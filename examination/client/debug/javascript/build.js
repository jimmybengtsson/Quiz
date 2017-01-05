(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

let GameOver = require('./GameOver.js');
let Questions = require('./Questions.js');
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

},{"./GameOver.js":2,"./HighScore.js":3,"./Questions.js":5}],2:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

function GameOver() {

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.gameover');
    document.querySelector('#answerbox').appendChild(classClone);

    let button = classClone.querySelector('.playagain');

    button.addEventListener('click', function() {

        location.reload();

    });


}

module.exports = GameOver;

},{}],3:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */


function HighScore() {

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.highscore');
    document.querySelector('#answerbox').appendChild(classClone);

    let button = classClone.querySelector('.playagain');

    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;

},{}],4:[function(require,module,exports){
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


},{"./Questions.js":5}],5:[function(require,module,exports){
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

function makeUL(Object) {

    let list = document.createElement('ul');

    for (let i = 0; i < Object.length; i++) {

        let item = document.createElement('li');

        let bText = Object[i];

        let bTag = document.createElement('input');
        bTag.setAttribute('type', 'submit');
        bTag.setAttribute('value', bText.value);
        bTag.setAttribute('name', Object.keys(array[i]));

        console.log(Object.keys(Object[i]));



        item.appendChild(bTag);

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

            let nextAnswerList = classClone.querySelectorAll('.answerlist');

            answerList.addEventListener('click', function(e){

                console.log(e.target.name);

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

},{"./Ajax.js":1,"./GameOver.js":2}],6:[function(require,module,exports){
let Name = require('./Name.js');

Name();

/*let GameOver = require('./GameOver.js');

GameOver();


let Questions = require('./Questions.js');

Questions();*/


},{"./Name.js":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL0hpZ2hTY29yZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcbmxldCBIaWdoU2NvcmUgPSByZXF1aXJlKCcuL0hpZ2hTY29yZS5qcycpO1xuXG5mdW5jdGlvbiByZXF1ZXN0KGNvbmZpZywgY2FsbGJhY2spIHtcblxuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbmZpZy5jb250ZW50VHlwZSA9IGNvbmZpZy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24vanNvbic7XG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxldCByZXNwb25zZVRleHQgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIGlmIChyZXEuc3RhdHVzID4gNDAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhyZXEuc3RhdHVzKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVGV4dC5tZXNzYWdlID09PSAnV3JvbmcgYW5zd2VyISA6KCcpIHtcblxuICAgICAgICAgICAgR2FtZU92ZXIoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVGV4dC5uZXh0VVJMID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgSGlnaFNjb3JlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcS5yZXNwb25zZVRleHQpO1xuXG5cbiAgICB9KTtcblxuICAgIHJlcS5vcGVuKGNvbmZpZy5tZXRob2QsIGNvbmZpZy51cmwpO1xuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCBjb25maWcuY29udGVudFR5cGUpO1xuXG4gICAgcmVxLnNlbmQoY29uZmlnLmFuc3dlcik7XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZXF1ZXN0OiByZXF1ZXN0XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuZnVuY3Rpb24gR2FtZU92ZXIoKSB7XG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5nYW1lb3ZlcicpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgIGxldCBidXR0b24gPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJy5wbGF5YWdhaW4nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuXG4gICAgfSk7XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVPdmVyO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuXG5mdW5jdGlvbiBIaWdoU2NvcmUoKSB7XG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5oaWdoc2NvcmUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICBsZXQgYnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcucGxheWFnYWluJyk7XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcblxuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID1IaWdoU2NvcmU7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmxldCBRdWVzdGlvbnMgPSByZXF1aXJlKCcuL1F1ZXN0aW9ucy5qcycpO1xuXG5sZXQgc2F2ZVRvU3RvcmFnZSA9IFtdO1xuXG5sZXQgY29uZmlnID0ge1xuICAgIHVybDogJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnXG59O1xuXG5mdW5jdGlvbiBOYW1lKCkge1xuXG4gICAgLypsZXQgcFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lJyk7XG4gICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1BsZWFzZSB3cml0ZSB5b3VyIG5hbWUgaGVyZSEnKTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgbGV0IHRleHRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQodGV4dElucHV0KTtcbiAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICBsZXQgYnV0dG9uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMZXRzIFBsYXkhJyk7XG4gICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChidXR0b25UZXh0KTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgIHdoaWxlIChwVGFnLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICBwVGFnLnJlbW92ZUNoaWxkKHBUYWcuZmlyc3RDaGlsZCk7XG4gICAgIH1cbiAgICAgUXVlc3Rpb25zKCk7XG4gICAgIH0pKi9cblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLm5hbWUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICBsZXQgc3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N1Ym1pdCcpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZXh0Jyk7XG5cbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5yZW1vdmVDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuXG4gICAgfSk7XG5cblxuXG5cbn1cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWU7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubGV0IEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3Zlci5qcycpO1xubGV0IEFqYXggPSByZXF1aXJlKCcuL0FqYXguanMnKTtcblxubGV0IGNvbmZpZyA9IHtcblxuICAgIHVybDogJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblxufTtcblxuZnVuY3Rpb24gbWFrZVVMKE9iamVjdCkge1xuXG4gICAgbGV0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPYmplY3QubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICAgICAgbGV0IGJUZXh0ID0gT2JqZWN0W2ldO1xuXG4gICAgICAgIGxldCBiVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgICAgIGJUYWcuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGJUZXh0LnZhbHVlKTtcbiAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBPYmplY3Qua2V5cyhhcnJheVtpXSkpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKE9iamVjdFtpXSkpO1xuXG5cblxuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGJUYWcpO1xuXG4gICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgfVxuXG5cbiAgICByZXR1cm4gbGlzdDtcblxufVxuXG5mdW5jdGlvbiBRdWVzdGlvbnMoaW5wdXQsIGFqYXhDb25maWcpIHtcblxuICAgIGxldCBhbnN3ZXIgPSB7XG4gICAgICAgIGFuc3dlcjogaW5wdXQudmFsdWVcbiAgICB9O1xuXG4gICAgYWpheENvbmZpZyA9IHtcbiAgICAgICAgdXJsOiBjb25maWcudXJsLFxuICAgICAgICBtZXRob2Q6IGNvbmZpZy5tZXRob2QsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBjb25maWcuY29udGVudFR5cGUsXG4gICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkoYW5zd2VyKVxuXG4gICAgfTtcblxuICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgIGxldCByZXF1ZXN0RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmV0d29yayBFcnJvcicgKyBlcnJvcik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0RGF0YS5hbHRlcm5hdGl2ZXMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvL0lmIHNpbmdsZSBhbnN3ZXIuXG5cbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xuICAgICAgICAgICAgcXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICAgICAgICAgbGV0IGFuc3dlcklucHV0ID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyJyk7XG4gICAgICAgICAgICBsZXQgYW5zd2VyQnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcjc3VibWl0YW5zd2VyJyk7XG5cblxuICAgICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy51cmwgPSByZXF1ZXN0RGF0YS5uZXh0VVJMO1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJQb3N0ID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcklucHV0LnZhbHVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWpheENvbmZpZy5hbnN3ZXIpO1xuXG4gICAgICAgICAgICAgICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRSZXF1ZXN0RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnVybCA9IG5leHRSZXF1ZXN0RGF0YS5uZXh0VVJMO1xuXG4gICAgICAgICAgICAgICAgICAgIFF1ZXN0aW9ucyhjb25maWcpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBJZiBtdWx0aWNob2ljZSBhbnN3ZXIuXG5cbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICAgICAgICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbmxpc3QnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xuICAgICAgICAgICAgcXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICAgICAgICAgbGV0IGFuc3dlckxpc3QgPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXJsaXN0Jyk7XG4gICAgICAgICAgICBsZXQgYWx0ZXJuYXRpdmVzID0gcmVxdWVzdERhdGEuYWx0ZXJuYXRpdmVzO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhbHRlcm5hdGl2ZXMpO1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gYWx0ZXJuYXRpdmVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYlRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgYWx0ZXJuYXRpdmVzW2ldKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgnbmFtZScsIGkpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChiVGFnKTtcblxuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgYW5zd2VyTGlzdC5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgICAgICAgICAgbGV0IG5leHRBbnN3ZXJMaXN0ID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yQWxsKCcuYW5zd2VybGlzdCcpO1xuXG4gICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5uYW1lKTtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5yZW1vdmVDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAgICAgICAgIGFqYXhDb25maWcudXJsID0gcmVxdWVzdERhdGEubmV4dFVSTDtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgICAgICAgICBsZXQgYW5zd2VyUG9zdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBlLnRhcmdldC5uYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG5cbiAgICAgICAgICAgICAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dFJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcudXJsID0gbmV4dFJlcXVlc3REYXRhLm5leHRVUkw7XG5cbiAgICAgICAgICAgICAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG5cblxuXG4gICAgLyogcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcblxuICAgICBsZXQgcXVlc3RPYmogPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShxdWVzdE9iai5xdWVzdGlvbik7XG4gICAgIGxldCBwVGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3F1ZXN0aW9ucycpO1xuICAgICBwVGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICBsZXQgcmVxUG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICBsZXQgbmV4dFVybCA9IHF1ZXN0T2JqLm5leHRVUkw7XG4gICAgIHJlcVBvc3Qub3BlbignUE9TVCcsIG5leHRVcmwpO1xuICAgICByZXFQb3N0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgICAgaWYgKHF1ZXN0T2JqLmFsdGVybmF0aXZlcykge1xuXG4gICAgIH1cblxuICAgICByZXFQb3N0LnNlbmQoKTtcblxuICAgICB9KTsqL1xuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9ucztcblxuLypcbmxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbmxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG5sZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuXG5sZXQgcXVlc3RPYmogPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xubGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocXVlc3RPYmoucXVlc3Rpb24pO1xuXG5sZXQgcXN0VGFnID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcucXN0Jyk7XG5xc3RUYWcuYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuXG5sZXQgYW5zd2VySW5wdXQgPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXInKTtcbmxldCBhbnN3ZXJCdXR0b24gPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXRhbnN3ZXInKTtcblxuYW5zd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbGV0IHJlcVBvc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBsZXQgbmV4dFVybCA9IHF1ZXN0T2JqLm5leHRVUkw7XG4gICAgcmVxUG9zdC5vcGVuKCdQT1NUJywgbmV4dFVybCk7XG4gICAgcmVxUG9zdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgbGV0IGFuc3dlclRvU2VuZCA9IHthbnN3ZXI6IGFuc3dlcklucHV0LnZhbHVlfTtcblxuICAgIHJlcVBvc3Quc2VuZChKU09OLnN0cmluZ2lmeShhbnN3ZXJUb1NlbmQpKTtcblxuICAgIHJlcVBvc3QuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHF1ZXN0T2JqID0gSlNPTi5wYXJzZShyZXFQb3N0LnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHF1ZXN0T2JqLm1lc3NhZ2UgPT09ICdXcm9uZyBhbnN3ZXIhIDooJykge1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykucmVtb3ZlQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICAgICAgICAgIEdhbWVPdmVyKCk7XG5cbiAgICAgICAgfVxuXG5cblxuXG4gICAgfSk7XG59KTtcbiovXG4iLCJsZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5OYW1lKCk7XG5cbi8qbGV0IEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3Zlci5qcycpO1xuXG5HYW1lT3ZlcigpO1xuXG5cbmxldCBRdWVzdGlvbnMgPSByZXF1aXJlKCcuL1F1ZXN0aW9ucy5qcycpO1xuXG5RdWVzdGlvbnMoKTsqL1xuXG4iXX0=
