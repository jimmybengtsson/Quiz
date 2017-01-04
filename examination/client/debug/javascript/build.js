(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

let GameOver = require('./GameOver.js');

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

},{"./GameOver.js":2,"./Questions.js":4}],2:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

function GameOver() {

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.gameover');
    document.querySelector('#answerbox').appendChild(classClone);

    let button = classClone.querySelector('#playagain');

    button.addEventListener('click', function() {

        location.reload();

    });


}

module.exports = GameOver;

},{}],3:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

let Questions = require('./Questions.js');

let saveToStorage = [];

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

    submit.addEventListener('click', function(e) {

        e.preventDefault();

        document.querySelector('#answerbox').removeChild(classClone);

        Questions(config);


    });




}





module.exports = Name;


},{"./Questions.js":4}],4:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

let GameOver = require('./GameOver.js');
let Ajax = require('./Ajax.js');

let config = {

    url: 'http://vhost3.lnu.se:20080/question/1',
    method: 'GET',
    contentType: 'application/json',

};

function makeUL(array) {

    let list = document.createElement('ul');

    for (let i = 0; i < array.length; i++) {

        let item = document.createElement('li');

        let aTag = document.createElement('a');


        aTag.appendChild(document.createTextNode(array[i]));

        item.appendChild(aTag);

        list.appendChild(item);
    }


    return list;

}

function Questions(input, ajaxConfig) {

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

                console.log(ajaxConfig.answer);

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

            console.log(alternatives);

            let list = makeUL(Object.values(alternatives));


            answerList.appendChild(list);
        }

    });





    /* req.addEventListener('load', function() {

     let questObj = JSON.parse(req.responseText);
     let textNode = document.createTextNode(questObj.question);
     let pTag = document.querySelector('#questions');
     pTag.appendChild(textNode);

     let reqPost = new XMLHttpRequest();
     let nextUrl = questObj.nextURL;
     reqPost.open('POST', nextUrl);
     reqPost.setRequestHeader('Content-type', 'application/json');

     if (questObj.alternatives) {

     }

     reqPost.send();

     });*/



}

module.exports = Questions;

/*
let template = document.querySelector('#answerbox template');
let clone = document.importNode(template.content, true);
let classClone = clone.querySelector('.questions');
document.querySelector('#answerbox').appendChild(classClone);


let questObj = JSON.parse(req.responseText);
let textNode = document.createTextNode(questObj.question);

let qstTag = classClone.querySelector('.qst');
qstTag.appendChild(textNode);

let answerInput = classClone.querySelector('#answer');
let answerButton = classClone.querySelector('#submitanswer');

answerButton.addEventListener('click', function(e) {

    e.preventDefault();

    let reqPost = new XMLHttpRequest();
    let nextUrl = questObj.nextURL;
    reqPost.open('POST', nextUrl);
    reqPost.setRequestHeader('Content-type', 'application/json');

    let answerToSend = {answer: answerInput.value};

    reqPost.send(JSON.stringify(answerToSend));

    reqPost.addEventListener('load', function() {

        questObj = JSON.parse(reqPost.responseText);

        if (questObj.message === 'Wrong answer! :(') {

            document.querySelector('#answerbox').removeChild(classClone);

            GameOver();

        }




    });
});
*/

},{"./Ajax.js":1,"./GameOver.js":2}],5:[function(require,module,exports){
let Name = require('./Name.js');

Name();

/*let GameOver = require('./GameOver.js');

GameOver();


let Questions = require('./Questions.js');

Questions();*/


},{"./Name.js":3}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL05hbWUuanMiLCJjbGllbnQvc291cmNlL2pzL1F1ZXN0aW9ucy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXIuanMnKTtcblxubGV0IFF1ZXN0aW9ucyA9IHJlcXVpcmUoJy4vUXVlc3Rpb25zLmpzJyk7XG5cbmZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnLCBjYWxsYmFjaykge1xuXG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QgfHwgJ0dFVCc7XG4gICAgY29uZmlnLnVybCA9IGNvbmZpZy51cmwgfHwgJyc7XG4gICAgY29uZmlnLmNvbnRlbnRUeXBlID0gY29uZmlnLmNvbnRlbnRUeXBlIHx8ICdhcHBsaWNhdGlvbi9qc29uJztcblxuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlVGV4dCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPiA0MDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VUZXh0Lm1lc3NhZ2UgPT09ICdXcm9uZyBhbnN3ZXIhIDooJykge1xuXG4gICAgICAgICAgICBHYW1lT3ZlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVxLnJlc3BvbnNlVGV4dCk7XG5cblxuICAgIH0pO1xuXG4gICAgcmVxLm9wZW4oY29uZmlnLm1ldGhvZCwgY29uZmlnLnVybCk7XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsIGNvbmZpZy5jb250ZW50VHlwZSk7XG5cbiAgICByZXEuc2VuZChjb25maWcuYW5zd2VyKTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlcXVlc3Q6IHJlcXVlc3Rcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5mdW5jdGlvbiBHYW1lT3ZlcigpIHtcblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLmdhbWVvdmVyJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgbGV0IGJ1dHRvbiA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignI3BsYXlhZ2FpbicpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICB9KTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU92ZXI7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmxldCBRdWVzdGlvbnMgPSByZXF1aXJlKCcuL1F1ZXN0aW9ucy5qcycpO1xuXG5sZXQgc2F2ZVRvU3RvcmFnZSA9IFtdO1xuXG5sZXQgY29uZmlnID0ge1xuICAgIHVybDogJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnXG59O1xuXG5mdW5jdGlvbiBOYW1lKCkge1xuXG4gICAgLypsZXQgcFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lJyk7XG4gICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1BsZWFzZSB3cml0ZSB5b3VyIG5hbWUgaGVyZSEnKTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgbGV0IHRleHRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQodGV4dElucHV0KTtcbiAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICBsZXQgYnV0dG9uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMZXRzIFBsYXkhJyk7XG4gICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChidXR0b25UZXh0KTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgIHdoaWxlIChwVGFnLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICBwVGFnLnJlbW92ZUNoaWxkKHBUYWcuZmlyc3RDaGlsZCk7XG4gICAgIH1cbiAgICAgUXVlc3Rpb25zKCk7XG4gICAgIH0pKi9cblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLm5hbWUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICBsZXQgc3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N1Ym1pdCcpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZXh0Jyk7XG5cbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5yZW1vdmVDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuXG4gICAgfSk7XG5cblxuXG5cbn1cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWU7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubGV0IEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3Zlci5qcycpO1xubGV0IEFqYXggPSByZXF1aXJlKCcuL0FqYXguanMnKTtcblxubGV0IGNvbmZpZyA9IHtcblxuICAgIHVybDogJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblxufTtcblxuZnVuY3Rpb24gbWFrZVVMKGFycmF5KSB7XG5cbiAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuXG4gICAgICAgIGxldCBhVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG5cbiAgICAgICAgYVRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhcnJheVtpXSkpO1xuXG4gICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoYVRhZyk7XG5cbiAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICB9XG5cblxuICAgIHJldHVybiBsaXN0O1xuXG59XG5cbmZ1bmN0aW9uIFF1ZXN0aW9ucyhpbnB1dCwgYWpheENvbmZpZykge1xuXG4gICAgbGV0IGFuc3dlciA9IHtcbiAgICAgICAgYW5zd2VyOiBpbnB1dC52YWx1ZVxuICAgIH07XG5cbiAgICBhamF4Q29uZmlnID0ge1xuICAgICAgICB1cmw6IGNvbmZpZy51cmwsXG4gICAgICAgIG1ldGhvZDogY29uZmlnLm1ldGhvZCxcbiAgICAgICAgY29udGVudFR5cGU6IGNvbmZpZy5jb250ZW50VHlwZSxcbiAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeShhbnN3ZXIpXG5cbiAgICB9O1xuXG4gICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgbGV0IHJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXR3b3JrIEVycm9yJyArIGVycm9yKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3REYXRhLmFsdGVybmF0aXZlcyA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vSWYgc2luZ2xlIGFuc3dlci5cblxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCB0ZW1wbGF0ZScpO1xuICAgICAgICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLnF1ZXN0aW9ucycpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXF1ZXN0RGF0YS5xdWVzdGlvbik7XG4gICAgICAgICAgICBsZXQgcXN0VGFnID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcucXN0Jyk7XG4gICAgICAgICAgICBxc3RUYWcuYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgYW5zd2VySW5wdXQgPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXInKTtcbiAgICAgICAgICAgIGxldCBhbnN3ZXJCdXR0b24gPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXRhbnN3ZXInKTtcblxuXG4gICAgICAgICAgICBhbnN3ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykucmVtb3ZlQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLnVybCA9IHJlcXVlc3REYXRhLm5leHRVUkw7XG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy5tZXRob2QgPSAnUE9TVCc7XG4gICAgICAgICAgICAgICAgbGV0IGFuc3dlclBvc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VySW5wdXQudmFsdWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcuYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkoYW5zd2VyUG9zdCk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhamF4Q29uZmlnLmFuc3dlcik7XG5cbiAgICAgICAgICAgICAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dFJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcudXJsID0gbmV4dFJlcXVlc3REYXRhLm5leHRVUkw7XG5cbiAgICAgICAgICAgICAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIElmIG11bHRpY2hvaWNlIGFuc3dlci5cblxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCB0ZW1wbGF0ZScpO1xuICAgICAgICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLnF1ZXN0aW9ubGlzdCcpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXF1ZXN0RGF0YS5xdWVzdGlvbik7XG4gICAgICAgICAgICBsZXQgcXN0VGFnID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcucXN0Jyk7XG4gICAgICAgICAgICBxc3RUYWcuYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgYW5zd2VyTGlzdCA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLmFuc3dlcmxpc3QnKTtcbiAgICAgICAgICAgIGxldCBhbHRlcm5hdGl2ZXMgPSByZXF1ZXN0RGF0YS5hbHRlcm5hdGl2ZXM7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFsdGVybmF0aXZlcyk7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gbWFrZVVMKE9iamVjdC52YWx1ZXMoYWx0ZXJuYXRpdmVzKSk7XG5cblxuICAgICAgICAgICAgYW5zd2VyTGlzdC5hcHBlbmRDaGlsZChsaXN0KTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cblxuXG5cblxuICAgIC8qIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgbGV0IHF1ZXN0T2JqID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocXVlc3RPYmoucXVlc3Rpb24pO1xuICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNxdWVzdGlvbnMnKTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgbGV0IHJlcVBvc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgbGV0IG5leHRVcmwgPSBxdWVzdE9iai5uZXh0VVJMO1xuICAgICByZXFQb3N0Lm9wZW4oJ1BPU1QnLCBuZXh0VXJsKTtcbiAgICAgcmVxUG9zdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgIGlmIChxdWVzdE9iai5hbHRlcm5hdGl2ZXMpIHtcblxuICAgICB9XG5cbiAgICAgcmVxUG9zdC5zZW5kKCk7XG5cbiAgICAgfSk7Ki9cblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbnM7XG5cbi8qXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG5sZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xubGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cblxubGV0IHF1ZXN0T2JqID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbmxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHF1ZXN0T2JqLnF1ZXN0aW9uKTtcblxubGV0IHFzdFRhZyA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xucXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxubGV0IGFuc3dlcklucHV0ID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyJyk7XG5sZXQgYW5zd2VyQnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjc3VibWl0YW5zd2VyJyk7XG5cbmFuc3dlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGxldCByZXFQb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IG5leHRVcmwgPSBxdWVzdE9iai5uZXh0VVJMO1xuICAgIHJlcVBvc3Qub3BlbignUE9TVCcsIG5leHRVcmwpO1xuICAgIHJlcVBvc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAgIGxldCBhbnN3ZXJUb1NlbmQgPSB7YW5zd2VyOiBhbnN3ZXJJbnB1dC52YWx1ZX07XG5cbiAgICByZXFQb3N0LnNlbmQoSlNPTi5zdHJpbmdpZnkoYW5zd2VyVG9TZW5kKSk7XG5cbiAgICByZXFQb3N0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBxdWVzdE9iaiA9IEpTT04ucGFyc2UocmVxUG9zdC5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIGlmIChxdWVzdE9iai5tZXNzYWdlID09PSAnV3JvbmcgYW5zd2VyISA6KCcpIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICBHYW1lT3ZlcigpO1xuXG4gICAgICAgIH1cblxuXG5cblxuICAgIH0pO1xufSk7XG4qL1xuIiwibGV0IE5hbWUgPSByZXF1aXJlKCcuL05hbWUuanMnKTtcblxuTmFtZSgpO1xuXG4vKmxldCBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXIuanMnKTtcblxuR2FtZU92ZXIoKTtcblxuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxuUXVlc3Rpb25zKCk7Ki9cblxuIl19
