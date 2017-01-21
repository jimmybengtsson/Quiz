(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

let GameOver = require('./GameOver.js');
let HighScore = require('./HighScore.js');
let Questions = require('./Questions.js');


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


    }.bind(this));

    req.open(config.method, config.url);
    req.setRequestHeader('Content-type', config.contentType);

    req.send(config.answer);


}

module.exports = {
    request: request
};

},{"./GameOver.js":2,"./HighScore.js":3,"./Questions.js":5}],2:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */


function GameOver() {

    while (this.answerBox.firstChild) {
        this.answerBox.removeChild(this.answerBox.firstChild);
    }

    let gameOverClone = this.clone.querySelector('.gameover');
    this.answerBox.appendChild(gameOverClone);

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

    let oldList = JSON.parse(localStorage.getItem('highScoreList')) || [];
    oldList.push(this.user);
    localStorage.setItem('highScoreList', JSON.stringify(oldList));



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
let Timer = require('./Timer.js');

let config = {

    url: 'http://vhost3.lnu.se:20080/question/1',
    method: 'GET',
    contentType: 'application/json',

};


function Questions(input, ajaxConfig) {

    this.twentySeconds = setTimeout(GameOver, 20000);

    Timer();

    this.template = document.querySelector('#answerbox template');
    this.clone = document.importNode(this.template.content, true);
    this.qstClone = this.clone.querySelector('.questions');
    this.qstListClone = this.clone.querySelector('.questionlist');
    this.answerBox = document.querySelector('#answerbox');

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

            this.answerBox.appendChild(this.qstClone);

            let textNode = document.createTextNode(requestData.question);
            let qstTag = this.qstClone.querySelector('.qst');
            qstTag.appendChild(textNode);

            let answerInput = this.qstClone.querySelector('#answer');
            let answerButton = this.qstClone.querySelector('#submitanswer');


            answerButton.addEventListener('click', function(e) {

                clearTimeout(this.twentySeconds);

                e.preventDefault();

                this.answerBox.removeChild(this.qstClone);

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

            }.bind(this));

        } else {

            // If multichoice answer.

            this.answerBox.appendChild(this.qstListClone);

            let textNode = document.createTextNode(requestData.question);
            let qstTag = this.qstListClone.querySelector('.qst');
            qstTag.appendChild(textNode);

            let answerList = this.qstListClone.querySelector('.answerlist');
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

                clearTimeout(this.twentySeconds);

                e.preventDefault();

                this.answerBox.removeChild(this.qstListClone);

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
            }.bind(this));
        }
    }.bind(this));
}

module.exports = Questions;

},{"./Ajax.js":1,"./GameOver.js":2,"./Timer.js":6}],6:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

function Timer() {

    let seconds = 20;

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let qstClone = clone.querySelector('.questions');
    let timer = qstClone.querySelector('.timer');



    let countDown = setInterval(function() {

        seconds --;

        timer.textContent = seconds;




        if (seconds <= 0) {
            clearInterval(countDown);
        }
    }, 1000);

    document.querySelector('#answerbox').appendChild(timer);



}

module.exports = Timer;

},{}],7:[function(require,module,exports){
let Name = require('./Name.js');

Name();


},{"./Name.js":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL0hpZ2hTY29yZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9UaW1lci5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxubGV0IEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3Zlci5qcycpO1xubGV0IEhpZ2hTY29yZSA9IHJlcXVpcmUoJy4vSGlnaFNjb3JlLmpzJyk7XG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxuXG5mdW5jdGlvbiByZXF1ZXN0KGNvbmZpZywgY2FsbGJhY2spIHtcblxuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbmZpZy5jb250ZW50VHlwZSA9IGNvbmZpZy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24vanNvbic7XG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxldCByZXNwb25zZVRleHQgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIGlmIChyZXEuc3RhdHVzID4gNDAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVGV4dC5tZXNzYWdlID09PSAnV3JvbmcgYW5zd2VyISA6KCcpIHtcblxuICAgICAgICAgICAgR2FtZU92ZXIoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVGV4dC5uZXh0VVJMID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgSGlnaFNjb3JlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcS5yZXNwb25zZVRleHQpO1xuXG5cbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgcmVxLm9wZW4oY29uZmlnLm1ldGhvZCwgY29uZmlnLnVybCk7XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsIGNvbmZpZy5jb250ZW50VHlwZSk7XG5cbiAgICByZXEuc2VuZChjb25maWcuYW5zd2VyKTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlcXVlc3Q6IHJlcXVlc3Rcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5cbmZ1bmN0aW9uIEdhbWVPdmVyKCkge1xuXG4gICAgd2hpbGUgKHRoaXMuYW5zd2VyQm94LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdGhpcy5hbnN3ZXJCb3gucmVtb3ZlQ2hpbGQodGhpcy5hbnN3ZXJCb3guZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgbGV0IGdhbWVPdmVyQ2xvbmUgPSB0aGlzLmNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5nYW1lb3ZlcicpO1xuICAgIHRoaXMuYW5zd2VyQm94LmFwcGVuZENoaWxkKGdhbWVPdmVyQ2xvbmUpO1xuXG4gICAgbGV0IGJ1dHRvbiA9IGdhbWVPdmVyQ2xvbmUucXVlcnlTZWxlY3RvcignLnBsYXlhZ2FpbicpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICB9KTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU92ZXI7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5sZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5cbmZ1bmN0aW9uIEhpZ2hTY29yZSgpIHtcblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLmhpZ2hzY29yZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgIGxldCBidXR0b24gPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJy5wbGF5YWdhaW4nKTtcblxuICAgIHRoaXMudXNlci5lbmQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMudXNlci50b3RhbCA9ICh0aGlzLnVzZXIuZW5kIC0gdGhpcy51c2VyLnN0YXJ0KS8xMDAwO1xuXG4gICAgbGV0IG9sZExpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaWdoU2NvcmVMaXN0JykpIHx8IFtdO1xuICAgIG9sZExpc3QucHVzaCh0aGlzLnVzZXIpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdoaWdoU2NvcmVMaXN0JywgSlNPTi5zdHJpbmdpZnkob2xkTGlzdCkpO1xuXG5cblxuICAgIGNvbnNvbGUubG9nKHRoaXMudXNlcik7XG5cblxuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9SGlnaFNjb3JlO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxubGV0IGNvbmZpZyA9IHtcbiAgICB1cmw6ICdodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xJ1xufTtcblxuZnVuY3Rpb24gTmFtZSgpIHtcblxuICAgIC8qbGV0IHBUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpO1xuICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdQbGVhc2Ugd3JpdGUgeW91ciBuYW1lIGhlcmUhJyk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgIGxldCB0ZXh0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICBwVGFnLmFwcGVuZENoaWxkKHRleHRJbnB1dCk7XG4gICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgbGV0IGJ1dHRvblRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGV0cyBQbGF5IScpO1xuICAgICBidXR0b24uYXBwZW5kQ2hpbGQoYnV0dG9uVGV4dCk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICB3aGlsZSAocFRhZy5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgcFRhZy5yZW1vdmVDaGlsZChwVGFnLmZpcnN0Q2hpbGQpO1xuICAgICB9XG4gICAgIFF1ZXN0aW9ucygpO1xuICAgICB9KSovXG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5uYW1lJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgbGV0IHN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQnKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGV4dCcpO1xuXG4gICAgdGhpcy51c2VyID0ge1xuXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBzdGFydDogJycsXG4gICAgICAgIGVuZDogJycsXG4gICAgICAgIHRvdGFsOiAnJ1xuICAgIH07XG5cbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgdGhpcy51c2VyLm5hbWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgdGhpcy51c2VyLnN0YXJ0ID0gc3RhcnRUaW1lO1xuXG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5yZW1vdmVDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWU7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbmxldCBBamF4ID0gcmVxdWlyZSgnLi9BamF4LmpzJyk7XG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5sZXQgVGltZXIgPSByZXF1aXJlKCcuL1RpbWVyLmpzJyk7XG5cbmxldCBjb25maWcgPSB7XG5cbiAgICB1cmw6ICdodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xJyxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cbn07XG5cblxuZnVuY3Rpb24gUXVlc3Rpb25zKGlucHV0LCBhamF4Q29uZmlnKSB7XG5cbiAgICB0aGlzLnR3ZW50eVNlY29uZHMgPSBzZXRUaW1lb3V0KEdhbWVPdmVyLCAyMDAwMCk7XG5cbiAgICBUaW1lcigpO1xuXG4gICAgdGhpcy50ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICB0aGlzLmNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIHRoaXMucXN0Q2xvbmUgPSB0aGlzLmNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbiAgICB0aGlzLnFzdExpc3RDbG9uZSA9IHRoaXMuY2xvbmUucXVlcnlTZWxlY3RvcignLnF1ZXN0aW9ubGlzdCcpO1xuICAgIHRoaXMuYW5zd2VyQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpO1xuXG4gICAgbGV0IGFuc3dlciA9IHtcbiAgICAgICAgYW5zd2VyOiBpbnB1dC52YWx1ZVxuICAgIH07XG5cbiAgICBhamF4Q29uZmlnID0ge1xuICAgICAgICB1cmw6IGNvbmZpZy51cmwsXG4gICAgICAgIG1ldGhvZDogY29uZmlnLm1ldGhvZCxcbiAgICAgICAgY29udGVudFR5cGU6IGNvbmZpZy5jb250ZW50VHlwZSxcbiAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeShhbnN3ZXIpXG5cbiAgICB9O1xuXG4gICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgbGV0IHJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXR3b3JrIEVycm9yJyArIGVycm9yKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3REYXRhLmFsdGVybmF0aXZlcyA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vSWYgc2luZ2xlIGFuc3dlci5cblxuICAgICAgICAgICAgdGhpcy5hbnN3ZXJCb3guYXBwZW5kQ2hpbGQodGhpcy5xc3RDbG9uZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3REYXRhLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGxldCBxc3RUYWcgPSB0aGlzLnFzdENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xc3QnKTtcbiAgICAgICAgICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBhbnN3ZXJJbnB1dCA9IHRoaXMucXN0Q2xvbmUucXVlcnlTZWxlY3RvcignI2Fuc3dlcicpO1xuICAgICAgICAgICAgbGV0IGFuc3dlckJ1dHRvbiA9IHRoaXMucXN0Q2xvbmUucXVlcnlTZWxlY3RvcignI3N1Ym1pdGFuc3dlcicpO1xuXG5cbiAgICAgICAgICAgIGFuc3dlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnR3ZW50eVNlY29uZHMpO1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJCb3gucmVtb3ZlQ2hpbGQodGhpcy5xc3RDbG9uZSk7XG5cbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLnVybCA9IHJlcXVlc3REYXRhLm5leHRVUkw7XG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy5tZXRob2QgPSAnUE9TVCc7XG4gICAgICAgICAgICAgICAgbGV0IGFuc3dlclBvc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VySW5wdXQudmFsdWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcuYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkoYW5zd2VyUG9zdCk7XG5cbiAgICAgICAgICAgICAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dFJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcudXJsID0gbmV4dFJlcXVlc3REYXRhLm5leHRVUkw7XG5cbiAgICAgICAgICAgICAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBJZiBtdWx0aWNob2ljZSBhbnN3ZXIuXG5cbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQm94LmFwcGVuZENoaWxkKHRoaXMucXN0TGlzdENsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IHRoaXMucXN0TGlzdENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xc3QnKTtcbiAgICAgICAgICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBhbnN3ZXJMaXN0ID0gdGhpcy5xc3RMaXN0Q2xvbmUucXVlcnlTZWxlY3RvcignLmFuc3dlcmxpc3QnKTtcbiAgICAgICAgICAgIGxldCBhbHRlcm5hdGl2ZXMgPSByZXF1ZXN0RGF0YS5hbHRlcm5hdGl2ZXM7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBhbHRlcm5hdGl2ZXMpIHtcblxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcblxuICAgICAgICAgICAgICAgIGxldCBiVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBhbHRlcm5hdGl2ZXNbaV0pO1xuICAgICAgICAgICAgICAgIGJUYWcuc2V0QXR0cmlidXRlKCduYW1lJywgaSk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGJUYWcpO1xuXG4gICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBhbnN3ZXJMaXN0LmFwcGVuZENoaWxkKGxpc3QpO1xuXG4gICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50d2VudHlTZWNvbmRzKTtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQm94LnJlbW92ZUNoaWxkKHRoaXMucXN0TGlzdENsb25lKTtcblxuICAgICAgICAgICAgICAgIGFqYXhDb25maWcudXJsID0gcmVxdWVzdERhdGEubmV4dFVSTDtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgICAgICAgICBsZXQgYW5zd2VyUG9zdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBlLnRhcmdldC5uYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG5cbiAgICAgICAgICAgICAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dFJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcudXJsID0gbmV4dFJlcXVlc3REYXRhLm5leHRVUkw7XG5cbiAgICAgICAgICAgICAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9ucztcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbmZ1bmN0aW9uIFRpbWVyKCkge1xuXG4gICAgbGV0IHNlY29uZHMgPSAyMDtcblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBxc3RDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbiAgICBsZXQgdGltZXIgPSBxc3RDbG9uZS5xdWVyeVNlbGVjdG9yKCcudGltZXInKTtcblxuXG5cbiAgICBsZXQgY291bnREb3duID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgc2Vjb25kcyAtLTtcblxuICAgICAgICB0aW1lci50ZXh0Q29udGVudCA9IHNlY29uZHM7XG5cblxuXG5cbiAgICAgICAgaWYgKHNlY29uZHMgPD0gMCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjb3VudERvd24pO1xuICAgICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQodGltZXIpO1xuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVyO1xuIiwibGV0IE5hbWUgPSByZXF1aXJlKCcuL05hbWUuanMnKTtcblxuTmFtZSgpO1xuXG4iXX0=
