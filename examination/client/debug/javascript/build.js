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

        if (req.status > 400) {
            callback(req.status);
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

function Questions(input) {

    let answer = {
        answer: input.value
    };

    let ajaxConfig = {
        url: 'http://vhost3.lnu.se:20080/question/1',
        method: 'GET',
        contentType: 'application/json',
        answer: JSON.stringify(answer)

    };

    Ajax.request(ajaxConfig, function(error, data) {
        if(error) {
            throw new Error('Network Error' + error);
        }

        let requestData = JSON.parse(data);

        console.log(data);

        if (requestData.alternatives === undefined) {

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

                ajaxConfig.url = requestData.nextURL;
                ajaxConfig.method = 'POST';
                let answerPost = {
                    answer: answerInput.value
                };
                ajaxConfig.answer = JSON.stringify(answerPost);

                console.log(ajaxConfig.answer);

                Ajax.request(ajaxConfig, function(error, data) {
                    console.log(data);
                });

            });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL05hbWUuanMiLCJjbGllbnQvc291cmNlL2pzL1F1ZXN0aW9ucy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5cbmxldCBRdWVzdGlvbnMgPSByZXF1aXJlKCcuL1F1ZXN0aW9ucy5qcycpO1xuXG5mdW5jdGlvbiByZXF1ZXN0KGNvbmZpZywgY2FsbGJhY2spIHtcblxuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbmZpZy5jb250ZW50VHlwZSA9IGNvbmZpZy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24vanNvbic7XG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmIChyZXEuc3RhdHVzID4gNDAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcS5yZXNwb25zZVRleHQpO1xuXG5cbiAgICB9KTtcblxuICAgIHJlcS5vcGVuKGNvbmZpZy5tZXRob2QsIGNvbmZpZy51cmwpO1xuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCBjb25maWcuY29udGVudFR5cGUpO1xuXG4gICAgcmVxLnNlbmQoY29uZmlnLmFuc3dlcik7XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZXF1ZXN0OiByZXF1ZXN0XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuZnVuY3Rpb24gR2FtZU92ZXIoKSB7XG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5nYW1lb3ZlcicpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgIGxldCBidXR0b24gPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJyNwbGF5YWdhaW4nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuXG4gICAgfSk7XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVPdmVyO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxubGV0IHNhdmVUb1N0b3JhZ2UgPSBbXTtcblxubGV0IGNvbmZpZyA9IHtcbiAgICB1cmw6ICdodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xJ1xufTtcblxuZnVuY3Rpb24gTmFtZSgpIHtcblxuICAgIC8qbGV0IHBUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpO1xuICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdQbGVhc2Ugd3JpdGUgeW91ciBuYW1lIGhlcmUhJyk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgIGxldCB0ZXh0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICBwVGFnLmFwcGVuZENoaWxkKHRleHRJbnB1dCk7XG4gICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgbGV0IGJ1dHRvblRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGV0cyBQbGF5IScpO1xuICAgICBidXR0b24uYXBwZW5kQ2hpbGQoYnV0dG9uVGV4dCk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICB3aGlsZSAocFRhZy5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgcFRhZy5yZW1vdmVDaGlsZChwVGFnLmZpcnN0Q2hpbGQpO1xuICAgICB9XG4gICAgIFF1ZXN0aW9ucygpO1xuICAgICB9KSovXG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5uYW1lJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgbGV0IHN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQnKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGV4dCcpO1xuXG4gICAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykucmVtb3ZlQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cblxuICAgIH0pO1xuXG5cblxuXG59XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBOYW1lO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmxldCBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXIuanMnKTtcbmxldCBBamF4ID0gcmVxdWlyZSgnLi9BamF4LmpzJyk7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9ucyhpbnB1dCkge1xuXG4gICAgbGV0IGFuc3dlciA9IHtcbiAgICAgICAgYW5zd2VyOiBpbnB1dC52YWx1ZVxuICAgIH07XG5cbiAgICBsZXQgYWpheENvbmZpZyA9IHtcbiAgICAgICAgdXJsOiAnaHR0cDovL3Zob3N0My5sbnUuc2U6MjAwODAvcXVlc3Rpb24vMScsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkoYW5zd2VyKVxuXG4gICAgfTtcblxuICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXR3b3JrIEVycm9yJyArIGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXF1ZXN0RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG5cbiAgICAgICAgaWYgKHJlcXVlc3REYXRhLmFsdGVybmF0aXZlcyA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xuICAgICAgICAgICAgcXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICAgICAgICAgbGV0IGFuc3dlcklucHV0ID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyJyk7XG4gICAgICAgICAgICBsZXQgYW5zd2VyQnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjc3VibWl0YW5zd2VyJyk7XG5cblxuICAgICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy51cmwgPSByZXF1ZXN0RGF0YS5uZXh0VVJMO1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJQb3N0ID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcklucHV0LnZhbHVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWpheENvbmZpZy5hbnN3ZXIpO1xuXG4gICAgICAgICAgICAgICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cblxuXG5cblxuICAgIC8qIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgbGV0IHF1ZXN0T2JqID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocXVlc3RPYmoucXVlc3Rpb24pO1xuICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNxdWVzdGlvbnMnKTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgbGV0IHJlcVBvc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgbGV0IG5leHRVcmwgPSBxdWVzdE9iai5uZXh0VVJMO1xuICAgICByZXFQb3N0Lm9wZW4oJ1BPU1QnLCBuZXh0VXJsKTtcbiAgICAgcmVxUG9zdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgIGlmIChxdWVzdE9iai5hbHRlcm5hdGl2ZXMpIHtcblxuICAgICB9XG5cbiAgICAgcmVxUG9zdC5zZW5kKCk7XG5cbiAgICAgfSk7Ki9cblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbnM7XG5cbi8qXG5sZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG5sZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xubGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cblxubGV0IHF1ZXN0T2JqID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbmxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHF1ZXN0T2JqLnF1ZXN0aW9uKTtcblxubGV0IHFzdFRhZyA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xucXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxubGV0IGFuc3dlcklucHV0ID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyJyk7XG5sZXQgYW5zd2VyQnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjc3VibWl0YW5zd2VyJyk7XG5cbmFuc3dlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGxldCByZXFQb3N0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IG5leHRVcmwgPSBxdWVzdE9iai5uZXh0VVJMO1xuICAgIHJlcVBvc3Qub3BlbignUE9TVCcsIG5leHRVcmwpO1xuICAgIHJlcVBvc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAgIGxldCBhbnN3ZXJUb1NlbmQgPSB7YW5zd2VyOiBhbnN3ZXJJbnB1dC52YWx1ZX07XG5cbiAgICByZXFQb3N0LnNlbmQoSlNPTi5zdHJpbmdpZnkoYW5zd2VyVG9TZW5kKSk7XG5cbiAgICByZXFQb3N0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBxdWVzdE9iaiA9IEpTT04ucGFyc2UocmVxUG9zdC5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIGlmIChxdWVzdE9iai5tZXNzYWdlID09PSAnV3JvbmcgYW5zd2VyISA6KCcpIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICBHYW1lT3ZlcigpO1xuXG4gICAgICAgIH1cblxuXG5cblxuICAgIH0pO1xufSk7XG4qL1xuIiwibGV0IE5hbWUgPSByZXF1aXJlKCcuL05hbWUuanMnKTtcblxuTmFtZSgpO1xuXG4vKmxldCBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXIuanMnKTtcblxuR2FtZU92ZXIoKTtcblxuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxuUXVlc3Rpb25zKCk7Ki9cblxuIl19
