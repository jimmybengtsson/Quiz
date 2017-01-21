(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

let GameOver = require('./GameOver.js');
let HighScore = require('./HighScore.js');

function request(config, callback) {

    config.method = config.method || 'GET';
    config.url = config.url || '';
    config.contentType = config.contentType || 'application/json';

    let req = new XMLHttpRequest();

    req.addEventListener('load', function() {

        let responseText = JSON.parse(req.responseText);

        if (req.status > 400) {
            callback(req.status);

        } else if (responseText.message === 'Wrong answer! :(') {

            GameOver();

        } else if (responseText.nextURL === undefined) {

            HighScore();

        }

        callback(null, req.responseText);


    });

    req.open(config.method, config.url);
    req.setRequestHeader('Content-type', config.contentType);

    req.send(config.answer);


}

module.exports = {
    request: request
};

},{"./GameOver.js":2,"./HighScore.js":3}],2:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */


function GameOver() {

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let gameOverClone = clone.querySelector('.gameover');
    document.querySelector('#answerbox').appendChild(gameOverClone);

    let button = gameOverClone.querySelector('.playagain');

    button.addEventListener('click', function() {

        location.reload();

    });


}

module.exports = GameOver;

},{}],3:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

let Name = require('./Name.js');


function HighScore() {

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.highscore');
    document.querySelector('#answerbox').appendChild(classClone);

    let button = classClone.querySelector('.playagain');

    this.user.end = new Date();
    this.user.total = (this.user.end - this.user.start)/1000;


    console.log(this.user);



    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;

},{"./Name.js":4}],4:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */


let Questions = require('./Questions.js');

let config = {
    url: 'http://vhost3.lnu.se:20080/question/1'
};

function Name() {

    /*let pTag = document.getElementById('name');
     let text = document.createTextNode('Please write your name here!');
     pTag.appendChild(text);
     let textInput = document.createElement('input');
     pTag.appendChild(textInput);
     let button = document.createElement('button');
     let buttonText = document.createTextNode('Lets Play!');
     button.appendChild(buttonText);
     pTag.appendChild(button);

     button.addEventListener('click', function() {

     while (pTag.hasChildNodes()) {
     pTag.removeChild(pTag.firstChild);
     }
     Questions();
     })*/

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.name');
    document.querySelector('#answerbox').appendChild(classClone);

    let submit = document.querySelector('#submit');
    let input = document.querySelector('#text');

    this.user = {

        name: '',
        start: '',
        end: '',
        total: ''
    };

    submit.addEventListener('click', function(e) {

        let startTime = new Date();

        this.user.name = input.value;
        this.user.start = startTime;


        e.preventDefault();

        document.querySelector('#answerbox').removeChild(classClone);

        Questions(config);


    }.bind(this));




}

module.exports = Name;


},{"./Questions.js":5}],5:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

let Ajax = require('./Ajax.js');
let GameOver = require('./GameOver.js');

let config = {

    url: 'http://vhost3.lnu.se:20080/question/1',
    method: 'GET',
    contentType: 'application/json',

};


function Questions(input, ajaxConfig) {

    window.setTimeout(GameOver, 20000);

    let answer = {
        answer: input.value
    };

    ajaxConfig = {
        url: config.url,
        method: config.method,
        contentType: config.contentType,
        answer: JSON.stringify(answer)

    };

    Ajax.request(ajaxConfig, function(error, data) {

        let requestData = JSON.parse(data);

        if(error) {
            throw new Error('Network Error' + error);

        } else if (requestData.alternatives === undefined) {

            //If single answer.

            let template = document.querySelector('#answerbox template');
            let clone = document.importNode(template.content, true);
            let classClone = clone.querySelector('.questions');
            document.querySelector('#answerbox').appendChild(classClone);

            let textNode = document.createTextNode(requestData.question);
            let qstTag = classClone.querySelector('.qst');
            qstTag.appendChild(textNode);

            let answerInput = classClone.querySelector('#answer');
            let answerButton = classClone.querySelector('#submitanswer');


            answerButton.addEventListener('click', function(e) {

                e.preventDefault();

                document.querySelector('#answerbox').removeChild(classClone);

                ajaxConfig.url = requestData.nextURL;
                ajaxConfig.method = 'POST';
                let answerPost = {
                    answer: answerInput.value
                };
                ajaxConfig.answer = JSON.stringify(answerPost);

                Ajax.request(ajaxConfig, function(error, data) {

                    let nextRequestData = JSON.parse(data);

                    config.url = nextRequestData.nextURL;

                    Questions(config);

                });

            });
        } else {

            // If multichoice answer.

            let template = document.querySelector('#answerbox template');
            let clone = document.importNode(template.content, true);
            let classClone = clone.querySelector('.questionlist');
            document.querySelector('#answerbox').appendChild(classClone);

            let textNode = document.createTextNode(requestData.question);
            let qstTag = classClone.querySelector('.qst');
            qstTag.appendChild(textNode);

            let answerList = classClone.querySelector('.answerlist');
            let alternatives = requestData.alternatives;

            let list = document.createElement('ul');

            for (let i in alternatives) {

                let item = document.createElement('li');

                let bTag = document.createElement('input');
                bTag.setAttribute('type', 'submit');
                bTag.setAttribute('value', alternatives[i]);
                bTag.setAttribute('name', i);

                item.appendChild(bTag);

                list.appendChild(item);
            }


            answerList.appendChild(list);

            answerList.addEventListener('click', function(e){

                e.preventDefault();

                document.querySelector('#answerbox').removeChild(classClone);

                ajaxConfig.url = requestData.nextURL;
                ajaxConfig.method = 'POST';
                let answerPost = {
                    answer: e.target.name
                };
                ajaxConfig.answer = JSON.stringify(answerPost);


                Ajax.request(ajaxConfig, function(error, data) {

                    let nextRequestData = JSON.parse(data);

                    config.url = nextRequestData.nextURL;

                    Questions(config);

                });
            });
        }
    });
}

module.exports = Questions;

},{"./Ajax.js":1,"./GameOver.js":2}],6:[function(require,module,exports){
let Name = require('./Name.js');

Name();


},{"./Name.js":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL0hpZ2hTY29yZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXIuanMnKTtcbmxldCBIaWdoU2NvcmUgPSByZXF1aXJlKCcuL0hpZ2hTY29yZS5qcycpO1xuXG5mdW5jdGlvbiByZXF1ZXN0KGNvbmZpZywgY2FsbGJhY2spIHtcblxuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbmZpZy5jb250ZW50VHlwZSA9IGNvbmZpZy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24vanNvbic7XG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxldCByZXNwb25zZVRleHQgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIGlmIChyZXEuc3RhdHVzID4gNDAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVGV4dC5tZXNzYWdlID09PSAnV3JvbmcgYW5zd2VyISA6KCcpIHtcblxuICAgICAgICAgICAgR2FtZU92ZXIoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVGV4dC5uZXh0VVJMID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgSGlnaFNjb3JlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcS5yZXNwb25zZVRleHQpO1xuXG5cbiAgICB9KTtcblxuICAgIHJlcS5vcGVuKGNvbmZpZy5tZXRob2QsIGNvbmZpZy51cmwpO1xuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCBjb25maWcuY29udGVudFR5cGUpO1xuXG4gICAgcmVxLnNlbmQoY29uZmlnLmFuc3dlcik7XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZXF1ZXN0OiByZXF1ZXN0XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuXG5mdW5jdGlvbiBHYW1lT3ZlcigpIHtcblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBnYW1lT3ZlckNsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLmdhbWVvdmVyJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGdhbWVPdmVyQ2xvbmUpO1xuXG4gICAgbGV0IGJ1dHRvbiA9IGdhbWVPdmVyQ2xvbmUucXVlcnlTZWxlY3RvcignLnBsYXlhZ2FpbicpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICB9KTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU92ZXI7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5sZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5cbmZ1bmN0aW9uIEhpZ2hTY29yZSgpIHtcblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLmhpZ2hzY29yZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgIGxldCBidXR0b24gPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJy5wbGF5YWdhaW4nKTtcblxuICAgIHRoaXMudXNlci5lbmQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMudXNlci50b3RhbCA9ICh0aGlzLnVzZXIuZW5kIC0gdGhpcy51c2VyLnN0YXJ0KS8xMDAwO1xuXG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLnVzZXIpO1xuXG5cblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuXG4gICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPUhpZ2hTY29yZTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cblxubGV0IFF1ZXN0aW9ucyA9IHJlcXVpcmUoJy4vUXVlc3Rpb25zLmpzJyk7XG5cbmxldCBjb25maWcgPSB7XG4gICAgdXJsOiAnaHR0cDovL3Zob3N0My5sbnUuc2U6MjAwODAvcXVlc3Rpb24vMSdcbn07XG5cbmZ1bmN0aW9uIE5hbWUoKSB7XG5cbiAgICAvKmxldCBwVGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hbWUnKTtcbiAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUGxlYXNlIHdyaXRlIHlvdXIgbmFtZSBoZXJlIScpO1xuICAgICBwVGFnLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICBsZXQgdGV4dElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZCh0ZXh0SW5wdXQpO1xuICAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgIGxldCBidXR0b25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xldHMgUGxheSEnKTtcbiAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGJ1dHRvblRleHQpO1xuICAgICBwVGFnLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cbiAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgd2hpbGUgKHBUYWcuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgIHBUYWcucmVtb3ZlQ2hpbGQocFRhZy5maXJzdENoaWxkKTtcbiAgICAgfVxuICAgICBRdWVzdGlvbnMoKTtcbiAgICAgfSkqL1xuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCB0ZW1wbGF0ZScpO1xuICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgbGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcubmFtZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgIGxldCBzdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3VibWl0Jyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RleHQnKTtcblxuICAgIHRoaXMudXNlciA9IHtcblxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgc3RhcnQ6ICcnLFxuICAgICAgICBlbmQ6ICcnLFxuICAgICAgICB0b3RhbDogJydcbiAgICB9O1xuXG4gICAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHRoaXMudXNlci5uYW1lID0gaW5wdXQudmFsdWU7XG4gICAgICAgIHRoaXMudXNlci5zdGFydCA9IHN0YXJ0VGltZTtcblxuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykucmVtb3ZlQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cblxuICAgIH0uYmluZCh0aGlzKSk7XG5cblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYW1lO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5sZXQgQWpheCA9IHJlcXVpcmUoJy4vQWpheC5qcycpO1xubGV0IEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3Zlci5qcycpO1xuXG5sZXQgY29uZmlnID0ge1xuXG4gICAgdXJsOiAnaHR0cDovL3Zob3N0My5sbnUuc2U6MjAwODAvcXVlc3Rpb24vMScsXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXG59O1xuXG5cbmZ1bmN0aW9uIFF1ZXN0aW9ucyhpbnB1dCwgYWpheENvbmZpZykge1xuXG4gICAgd2luZG93LnNldFRpbWVvdXQoR2FtZU92ZXIsIDIwMDAwKTtcblxuICAgIGxldCBhbnN3ZXIgPSB7XG4gICAgICAgIGFuc3dlcjogaW5wdXQudmFsdWVcbiAgICB9O1xuXG4gICAgYWpheENvbmZpZyA9IHtcbiAgICAgICAgdXJsOiBjb25maWcudXJsLFxuICAgICAgICBtZXRob2Q6IGNvbmZpZy5tZXRob2QsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBjb25maWcuY29udGVudFR5cGUsXG4gICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkoYW5zd2VyKVxuXG4gICAgfTtcblxuICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgIGxldCByZXF1ZXN0RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmV0d29yayBFcnJvcicgKyBlcnJvcik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0RGF0YS5hbHRlcm5hdGl2ZXMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvL0lmIHNpbmdsZSBhbnN3ZXIuXG5cbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xuICAgICAgICAgICAgcXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICAgICAgICAgbGV0IGFuc3dlcklucHV0ID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyJyk7XG4gICAgICAgICAgICBsZXQgYW5zd2VyQnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjc3VibWl0YW5zd2VyJyk7XG5cblxuICAgICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy51cmwgPSByZXF1ZXN0RGF0YS5uZXh0VVJMO1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJQb3N0ID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcklucHV0LnZhbHVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG4gICAgICAgICAgICAgICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRSZXF1ZXN0RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnVybCA9IG5leHRSZXF1ZXN0RGF0YS5uZXh0VVJMO1xuXG4gICAgICAgICAgICAgICAgICAgIFF1ZXN0aW9ucyhjb25maWcpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBJZiBtdWx0aWNob2ljZSBhbnN3ZXIuXG5cbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbmxpc3QnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xuICAgICAgICAgICAgcXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICAgICAgICAgbGV0IGFuc3dlckxpc3QgPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXJsaXN0Jyk7XG4gICAgICAgICAgICBsZXQgYWx0ZXJuYXRpdmVzID0gcmVxdWVzdERhdGEuYWx0ZXJuYXRpdmVzO1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gYWx0ZXJuYXRpdmVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYlRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgYWx0ZXJuYXRpdmVzW2ldKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgnbmFtZScsIGkpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChiVGFnKTtcblxuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgYW5zd2VyTGlzdC5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy51cmwgPSByZXF1ZXN0RGF0YS5uZXh0VVJMO1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJQb3N0ID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGUudGFyZ2V0Lm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcuYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkoYW5zd2VyUG9zdCk7XG5cblxuICAgICAgICAgICAgICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0UmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBuZXh0UmVxdWVzdERhdGEubmV4dFVSTDtcblxuICAgICAgICAgICAgICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbnM7XG4iLCJsZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5OYW1lKCk7XG5cbiJdfQ==
