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

let Ajax = require('./Ajax.js');

let config = {

    url: 'http://vhost3.lnu.se:20080/question/1',
    method: 'GET',
    contentType: 'application/json',

};


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
}

module.exports = Questions;

},{"./Ajax.js":1}],6:[function(require,module,exports){
let Name = require('./Name.js');

Name();


},{"./Name.js":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL0hpZ2hTY29yZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5sZXQgSGlnaFNjb3JlID0gcmVxdWlyZSgnLi9IaWdoU2NvcmUuanMnKTtcblxuZnVuY3Rpb24gcmVxdWVzdChjb25maWcsIGNhbGxiYWNrKSB7XG5cbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZCB8fCAnR0VUJztcbiAgICBjb25maWcudXJsID0gY29uZmlnLnVybCB8fCAnJztcbiAgICBjb25maWcuY29udGVudFR5cGUgPSBjb25maWcuY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL2pzb24nO1xuXG4gICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsZXQgcmVzcG9uc2VUZXh0ID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICBpZiAocmVxLnN0YXR1cyA+IDQwMCkge1xuICAgICAgICAgICAgY2FsbGJhY2socmVxLnN0YXR1cyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZVRleHQubWVzc2FnZSA9PT0gJ1dyb25nIGFuc3dlciEgOignKSB7XG5cbiAgICAgICAgICAgIEdhbWVPdmVyKCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZVRleHQubmV4dFVSTCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIEhpZ2hTY29yZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXEucmVzcG9uc2VUZXh0KTtcblxuXG4gICAgfSk7XG5cbiAgICByZXEub3Blbihjb25maWcubWV0aG9kLCBjb25maWcudXJsKTtcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgY29uZmlnLmNvbnRlbnRUeXBlKTtcblxuICAgIHJlcS5zZW5kKGNvbmZpZy5hbnN3ZXIpO1xuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbmZ1bmN0aW9uIEdhbWVPdmVyKCkge1xuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCB0ZW1wbGF0ZScpO1xuICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgbGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcuZ2FtZW92ZXInKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICBsZXQgYnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcucGxheWFnYWluJyk7XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcblxuICAgIH0pO1xuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT3ZlcjtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cblxuZnVuY3Rpb24gSGlnaFNjb3JlKCkge1xuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCB0ZW1wbGF0ZScpO1xuICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgbGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcuaGlnaHNjb3JlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgbGV0IGJ1dHRvbiA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnBsYXlhZ2FpbicpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9SGlnaFNjb3JlO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxubGV0IHNhdmVUb1N0b3JhZ2UgPSBbXTtcblxubGV0IGNvbmZpZyA9IHtcbiAgICB1cmw6ICdodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xJ1xufTtcblxuZnVuY3Rpb24gTmFtZSgpIHtcblxuICAgIC8qbGV0IHBUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpO1xuICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdQbGVhc2Ugd3JpdGUgeW91ciBuYW1lIGhlcmUhJyk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgIGxldCB0ZXh0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICBwVGFnLmFwcGVuZENoaWxkKHRleHRJbnB1dCk7XG4gICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgbGV0IGJ1dHRvblRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGV0cyBQbGF5IScpO1xuICAgICBidXR0b24uYXBwZW5kQ2hpbGQoYnV0dG9uVGV4dCk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICB3aGlsZSAocFRhZy5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgcFRhZy5yZW1vdmVDaGlsZChwVGFnLmZpcnN0Q2hpbGQpO1xuICAgICB9XG4gICAgIFF1ZXN0aW9ucygpO1xuICAgICB9KSovXG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5uYW1lJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgbGV0IHN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQnKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGV4dCcpO1xuXG4gICAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykucmVtb3ZlQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cblxuICAgIH0pO1xuXG5cblxuXG59XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBOYW1lO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmxldCBBamF4ID0gcmVxdWlyZSgnLi9BamF4LmpzJyk7XG5cbmxldCBjb25maWcgPSB7XG5cbiAgICB1cmw6ICdodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xJyxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cbn07XG5cblxuZnVuY3Rpb24gUXVlc3Rpb25zKGlucHV0LCBhamF4Q29uZmlnKSB7XG5cbiAgICBsZXQgYW5zd2VyID0ge1xuICAgICAgICBhbnN3ZXI6IGlucHV0LnZhbHVlXG4gICAgfTtcblxuICAgIGFqYXhDb25maWcgPSB7XG4gICAgICAgIHVybDogY29uZmlnLnVybCxcbiAgICAgICAgbWV0aG9kOiBjb25maWcubWV0aG9kLFxuICAgICAgICBjb250ZW50VHlwZTogY29uZmlnLmNvbnRlbnRUeXBlLFxuICAgICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KGFuc3dlcilcblxuICAgIH07XG5cbiAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICBsZXQgcmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgRXJyb3InICsgZXJyb3IpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdERhdGEuYWx0ZXJuYXRpdmVzID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy9JZiBzaW5nbGUgYW5zd2VyLlxuXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgICAgICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgbGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3REYXRhLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGxldCBxc3RUYWcgPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xc3QnKTtcbiAgICAgICAgICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBhbnN3ZXJJbnB1dCA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignI2Fuc3dlcicpO1xuICAgICAgICAgICAgbGV0IGFuc3dlckJ1dHRvbiA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignI3N1Ym1pdGFuc3dlcicpO1xuXG5cbiAgICAgICAgICAgIGFuc3dlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5yZW1vdmVDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAgICAgICAgIGFqYXhDb25maWcudXJsID0gcmVxdWVzdERhdGEubmV4dFVSTDtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgICAgICAgICBsZXQgYW5zd2VyUG9zdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJJbnB1dC52YWx1ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy5hbnN3ZXIgPSBKU09OLnN0cmluZ2lmeShhbnN3ZXJQb3N0KTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFqYXhDb25maWcuYW5zd2VyKTtcblxuICAgICAgICAgICAgICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0UmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBuZXh0UmVxdWVzdERhdGEubmV4dFVSTDtcblxuICAgICAgICAgICAgICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gSWYgbXVsdGljaG9pY2UgYW5zd2VyLlxuXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgICAgICAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgbGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25saXN0Jyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3REYXRhLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGxldCBxc3RUYWcgPSBjbGFzc0Nsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xc3QnKTtcbiAgICAgICAgICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBhbnN3ZXJMaXN0ID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcuYW5zd2VybGlzdCcpO1xuICAgICAgICAgICAgbGV0IGFsdGVybmF0aXZlcyA9IHJlcXVlc3REYXRhLmFsdGVybmF0aXZlcztcblxuICAgICAgICAgICAgY29uc29sZS5sb2coYWx0ZXJuYXRpdmVzKTtcblxuICAgICAgICAgICAgbGV0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGFsdGVybmF0aXZlcykge1xuXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGJUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGJUYWcuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgIGJUYWcuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGFsdGVybmF0aXZlc1tpXSk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBpKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQoYlRhZyk7XG5cbiAgICAgICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGFuc3dlckxpc3QuYXBwZW5kQ2hpbGQobGlzdCk7XG5cbiAgICAgICAgICAgIGFuc3dlckxpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0Lm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy51cmwgPSByZXF1ZXN0RGF0YS5uZXh0VVJMO1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJQb3N0ID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGUudGFyZ2V0Lm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcuYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkoYW5zd2VyUG9zdCk7XG5cblxuICAgICAgICAgICAgICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0UmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBuZXh0UmVxdWVzdERhdGEubmV4dFVSTDtcblxuICAgICAgICAgICAgICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbnM7XG4iLCJsZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5OYW1lKCk7XG5cbiJdfQ==
