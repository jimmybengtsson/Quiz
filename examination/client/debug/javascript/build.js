(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

// Module imports.

let GameOver = require('./GameOver.js');
let HighScore = require('./HighScore.js');
let Questions = require('./Questions.js');

// Ajax request function.

function request(config, callback) {

    // Parameters for the config.

    config.method = config.method || 'GET';
    config.url = config.url || '';
    config.contentType = config.contentType || 'application/json';

    // Send request.

    let req = new XMLHttpRequest();

    // Add listener for answer from server.

    req.addEventListener('load', function() {

        let responseText = JSON.parse(req.responseText);

        // If error.

        if (req.status > 400) {
            callback(req.status);

            // Gameover if wrong answer.

        } else if (responseText.message === 'Wrong answer! :(') {

            GameOver();

            // Highscore if last question.

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

    // Remove nodes from answerbox-div if there is any.

    while (this.answerBox.firstChild) {
        this.answerBox.removeChild(this.answerBox.firstChild);
    }

    // Add the gameover template.

    let gameOverClone = this.clone.querySelector('.gameover');
    this.answerBox.appendChild(gameOverClone);

    // Add button and listener for reload.

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

// Module imports.

let Name = require('./Name.js');

function HighScore() {

    // Add highscore template.

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.highscore');
    document.querySelector('#answerbox').appendChild(classClone);

    // Set the end time for the highscore time and calculate total time.

    this.user.end = new Date();
    this.user.total = (this.user.end - this.user.start)/1000;

    // Get the highscore list from storage and if none then add array.
    // Add the sessions name and time to the list and save to storage again.

    let oldList = JSON.parse(localStorage.getItem('highScoreList')) || [];

    oldList.push(this.user);

    // Sort the list after total time.

    function sortList(a,b) {
        if (a.total < b.total)
            return -1;
        if (a.total > b.total)
            return 1;
        return 0;
    }

    oldList.sort(sortList);

    // Only the 5 fastest in list.

    if (oldList.length > 5) {
        oldList.length = 5;
    }

    localStorage.setItem('highScoreList', JSON.stringify(oldList));

    for (let i = 0; i < oldList.length; i++) {
        let liClone = document.createElement('li');
        liClone.appendChild(document.createTextNode(oldList[i].name + ' - ' + oldList[i].total + 's'));
        classClone.querySelector('.highscoreList').appendChild(liClone);

    }

    console.log(oldList);

    // Start over button.

    let button = classClone.querySelector('.playagain');


    // Add listener for reload.

    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;

},{"./Name.js":4}],4:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

// Module imports

let Questions = require('./Questions.js');

// Config for the ajax call

let config = {
    url: 'http://vhost3.lnu.se:20080/question/1'
};

// Function for name input.

function Name() {

    // Import name template

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.name');
    document.querySelector('#answerbox').appendChild(classClone);

    let submit = document.querySelector('#submit');
    let input = document.querySelector('#text');

    // Adding a user for high score list.

    this.user = {

        name: '',
        start: '',
        end: '',
        total: '',
    };

    submit.addEventListener('click', function(e) {

        let startTime = new Date();

        // Assign name from input and start time.

        this.user.name = input.value;
        this.user.start = startTime;


        e.preventDefault();

        document.querySelector('#answerbox').removeChild(classClone);

        // Calling Questions function.

        Questions(config);


    }.bind(this));




}

module.exports = Name;


},{"./Questions.js":5}],5:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

// Module imports.

let Ajax = require('./Ajax.js');
let GameOver = require('./GameOver.js');
let Timer = require('./Timer.js');

// Adding properties to the ajax config.

let config = {

    url: 'http://vhost3.lnu.se:20080/question/1',
    method: 'GET',
    contentType: 'application/json',

};

// Function for the questions.

function Questions(input, ajaxConfig) {

    // Set 20 s.

    this.twentySeconds = setTimeout(GameOver, 20000);

    // Adding a countdown timer.

    Timer();

    // Import questions template

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

    // Make call to the server.

    Ajax.request(ajaxConfig, function(error, data) {

        let requestData = JSON.parse(data);

        // Error message.

        if(error) {
            throw new Error('Network Error' + error);

            //If single answer.

        } else if (requestData.alternatives === undefined) {

            // Import single question template and append it to answerbox-div.

            this.answerBox.appendChild(this.qstClone);

            let textNode = document.createTextNode(requestData.question);
            let qstTag = this.qstClone.querySelector('.qst');
            qstTag.appendChild(textNode);

            let answerInput = this.qstClone.querySelector('#answer');
            let answerButton = this.qstClone.querySelector('#submitanswer');

            // Add listener for answer input.

            answerButton.addEventListener('click', function(e) {

                // Remove the 20 s to gameover countdown.

                clearTimeout(this.twentySeconds);

                // Prevent reload.

                e.preventDefault();

                // Remove the answered question.

                this.answerBox.removeChild(this.qstClone);

                // Change parameters to get next question.

                ajaxConfig.url = requestData.nextURL;
                ajaxConfig.method = 'POST';
                let answerPost = {
                    answer: answerInput.value
                };
                ajaxConfig.answer = JSON.stringify(answerPost);

                // Send answer to server for the next question.

                Ajax.request(ajaxConfig, function(error, data) {

                    let nextRequestData = JSON.parse(data);

                    config.url = nextRequestData.nextURL;

                    Questions(config);

                });

            }.bind(this));

            // If multi choice answer.

        } else {

            // Import multi question template and append it to answerbox-div.

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

            // Add listener for answer input.

            answerList.addEventListener('click', function(e){

                // Remove the 20 s to gameover countdown.

                clearTimeout(this.twentySeconds);

                // Prevent reload.

                e.preventDefault();

                // Remove the answered question.

                this.answerBox.removeChild(this.qstListClone);

                // Change parameters to get next question.

                ajaxConfig.url = requestData.nextURL;
                ajaxConfig.method = 'POST';
                let answerPost = {
                    answer: e.target.name
                };
                ajaxConfig.answer = JSON.stringify(answerPost);

                // Send answer to server for the next question.

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

    // Set the timer length.

    let seconds = 20;

    // Import timer template.

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let qstClone = clone.querySelector('.questions');
    let timer = qstClone.querySelector('.timer');

    // Set interval so the timer counts down every second.

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
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

let Name = require('./Name.js');

Name();


},{"./Name.js":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL0hpZ2hTY29yZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9UaW1lci5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuLy8gTW9kdWxlIGltcG9ydHMuXG5cbmxldCBHYW1lT3ZlciA9IHJlcXVpcmUoJy4vR2FtZU92ZXIuanMnKTtcbmxldCBIaWdoU2NvcmUgPSByZXF1aXJlKCcuL0hpZ2hTY29yZS5qcycpO1xubGV0IFF1ZXN0aW9ucyA9IHJlcXVpcmUoJy4vUXVlc3Rpb25zLmpzJyk7XG5cbi8vIEFqYXggcmVxdWVzdCBmdW5jdGlvbi5cblxuZnVuY3Rpb24gcmVxdWVzdChjb25maWcsIGNhbGxiYWNrKSB7XG5cbiAgICAvLyBQYXJhbWV0ZXJzIGZvciB0aGUgY29uZmlnLlxuXG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QgfHwgJ0dFVCc7XG4gICAgY29uZmlnLnVybCA9IGNvbmZpZy51cmwgfHwgJyc7XG4gICAgY29uZmlnLmNvbnRlbnRUeXBlID0gY29uZmlnLmNvbnRlbnRUeXBlIHx8ICdhcHBsaWNhdGlvbi9qc29uJztcblxuICAgIC8vIFNlbmQgcmVxdWVzdC5cblxuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEFkZCBsaXN0ZW5lciBmb3IgYW5zd2VyIGZyb20gc2VydmVyLlxuXG4gICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsZXQgcmVzcG9uc2VUZXh0ID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAvLyBJZiBlcnJvci5cblxuICAgICAgICBpZiAocmVxLnN0YXR1cyA+IDQwMCkge1xuICAgICAgICAgICAgY2FsbGJhY2socmVxLnN0YXR1cyk7XG5cbiAgICAgICAgICAgIC8vIEdhbWVvdmVyIGlmIHdyb25nIGFuc3dlci5cblxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlVGV4dC5tZXNzYWdlID09PSAnV3JvbmcgYW5zd2VyISA6KCcpIHtcblxuICAgICAgICAgICAgR2FtZU92ZXIoKTtcblxuICAgICAgICAgICAgLy8gSGlnaHNjb3JlIGlmIGxhc3QgcXVlc3Rpb24uXG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZVRleHQubmV4dFVSTCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIEhpZ2hTY29yZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXEucmVzcG9uc2VUZXh0KTtcblxuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJlcS5vcGVuKGNvbmZpZy5tZXRob2QsIGNvbmZpZy51cmwpO1xuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCBjb25maWcuY29udGVudFR5cGUpO1xuXG4gICAgcmVxLnNlbmQoY29uZmlnLmFuc3dlcik7XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZXF1ZXN0OiByZXF1ZXN0XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuXG5mdW5jdGlvbiBHYW1lT3ZlcigpIHtcblxuICAgIC8vIFJlbW92ZSBub2RlcyBmcm9tIGFuc3dlcmJveC1kaXYgaWYgdGhlcmUgaXMgYW55LlxuXG4gICAgd2hpbGUgKHRoaXMuYW5zd2VyQm94LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdGhpcy5hbnN3ZXJCb3gucmVtb3ZlQ2hpbGQodGhpcy5hbnN3ZXJCb3guZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBnYW1lb3ZlciB0ZW1wbGF0ZS5cblxuICAgIGxldCBnYW1lT3ZlckNsb25lID0gdGhpcy5jbG9uZS5xdWVyeVNlbGVjdG9yKCcuZ2FtZW92ZXInKTtcbiAgICB0aGlzLmFuc3dlckJveC5hcHBlbmRDaGlsZChnYW1lT3ZlckNsb25lKTtcblxuICAgIC8vIEFkZCBidXR0b24gYW5kIGxpc3RlbmVyIGZvciByZWxvYWQuXG5cbiAgICBsZXQgYnV0dG9uID0gZ2FtZU92ZXJDbG9uZS5xdWVyeVNlbGVjdG9yKCcucGxheWFnYWluJyk7XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcblxuICAgIH0pO1xuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT3ZlcjtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbi8vIE1vZHVsZSBpbXBvcnRzLlxuXG5sZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5mdW5jdGlvbiBIaWdoU2NvcmUoKSB7XG5cbiAgICAvLyBBZGQgaGlnaHNjb3JlIHRlbXBsYXRlLlxuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCB0ZW1wbGF0ZScpO1xuICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgbGV0IGNsYXNzQ2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcuaGlnaHNjb3JlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgLy8gU2V0IHRoZSBlbmQgdGltZSBmb3IgdGhlIGhpZ2hzY29yZSB0aW1lIGFuZCBjYWxjdWxhdGUgdG90YWwgdGltZS5cblxuICAgIHRoaXMudXNlci5lbmQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMudXNlci50b3RhbCA9ICh0aGlzLnVzZXIuZW5kIC0gdGhpcy51c2VyLnN0YXJ0KS8xMDAwO1xuXG4gICAgLy8gR2V0IHRoZSBoaWdoc2NvcmUgbGlzdCBmcm9tIHN0b3JhZ2UgYW5kIGlmIG5vbmUgdGhlbiBhZGQgYXJyYXkuXG4gICAgLy8gQWRkIHRoZSBzZXNzaW9ucyBuYW1lIGFuZCB0aW1lIHRvIHRoZSBsaXN0IGFuZCBzYXZlIHRvIHN0b3JhZ2UgYWdhaW4uXG5cbiAgICBsZXQgb2xkTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZ2hTY29yZUxpc3QnKSkgfHwgW107XG5cbiAgICBvbGRMaXN0LnB1c2godGhpcy51c2VyKTtcblxuICAgIC8vIFNvcnQgdGhlIGxpc3QgYWZ0ZXIgdG90YWwgdGltZS5cblxuICAgIGZ1bmN0aW9uIHNvcnRMaXN0KGEsYikge1xuICAgICAgICBpZiAoYS50b3RhbCA8IGIudG90YWwpXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIGlmIChhLnRvdGFsID4gYi50b3RhbClcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBvbGRMaXN0LnNvcnQoc29ydExpc3QpO1xuXG4gICAgLy8gT25seSB0aGUgNSBmYXN0ZXN0IGluIGxpc3QuXG5cbiAgICBpZiAob2xkTGlzdC5sZW5ndGggPiA1KSB7XG4gICAgICAgIG9sZExpc3QubGVuZ3RoID0gNTtcbiAgICB9XG5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaGlnaFNjb3JlTGlzdCcsIEpTT04uc3RyaW5naWZ5KG9sZExpc3QpKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2xkTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbGlDbG9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpQ2xvbmUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob2xkTGlzdFtpXS5uYW1lICsgJyAtICcgKyBvbGRMaXN0W2ldLnRvdGFsICsgJ3MnKSk7XG4gICAgICAgIGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLmhpZ2hzY29yZUxpc3QnKS5hcHBlbmRDaGlsZChsaUNsb25lKTtcblxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKG9sZExpc3QpO1xuXG4gICAgLy8gU3RhcnQgb3ZlciBidXR0b24uXG5cbiAgICBsZXQgYnV0dG9uID0gY2xhc3NDbG9uZS5xdWVyeVNlbGVjdG9yKCcucGxheWFnYWluJyk7XG5cblxuICAgIC8vIEFkZCBsaXN0ZW5lciBmb3IgcmVsb2FkLlxuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9SGlnaFNjb3JlO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuLy8gTW9kdWxlIGltcG9ydHNcblxubGV0IFF1ZXN0aW9ucyA9IHJlcXVpcmUoJy4vUXVlc3Rpb25zLmpzJyk7XG5cbi8vIENvbmZpZyBmb3IgdGhlIGFqYXggY2FsbFxuXG5sZXQgY29uZmlnID0ge1xuICAgIHVybDogJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnXG59O1xuXG4vLyBGdW5jdGlvbiBmb3IgbmFtZSBpbnB1dC5cblxuZnVuY3Rpb24gTmFtZSgpIHtcblxuICAgIC8vIEltcG9ydCBuYW1lIHRlbXBsYXRlXG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgY2xhc3NDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5uYW1lJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgbGV0IHN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQnKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGV4dCcpO1xuXG4gICAgLy8gQWRkaW5nIGEgdXNlciBmb3IgaGlnaCBzY29yZSBsaXN0LlxuXG4gICAgdGhpcy51c2VyID0ge1xuXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBzdGFydDogJycsXG4gICAgICAgIGVuZDogJycsXG4gICAgICAgIHRvdGFsOiAnJyxcbiAgICB9O1xuXG4gICAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIC8vIEFzc2lnbiBuYW1lIGZyb20gaW5wdXQgYW5kIHN0YXJ0IHRpbWUuXG5cbiAgICAgICAgdGhpcy51c2VyLm5hbWUgPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgdGhpcy51c2VyLnN0YXJ0ID0gc3RhcnRUaW1lO1xuXG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5yZW1vdmVDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgICAgICAvLyBDYWxsaW5nIFF1ZXN0aW9ucyBmdW5jdGlvbi5cblxuICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWU7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbi8vIE1vZHVsZSBpbXBvcnRzLlxuXG5sZXQgQWpheCA9IHJlcXVpcmUoJy4vQWpheC5qcycpO1xubGV0IEdhbWVPdmVyID0gcmVxdWlyZSgnLi9HYW1lT3Zlci5qcycpO1xubGV0IFRpbWVyID0gcmVxdWlyZSgnLi9UaW1lci5qcycpO1xuXG4vLyBBZGRpbmcgcHJvcGVydGllcyB0byB0aGUgYWpheCBjb25maWcuXG5cbmxldCBjb25maWcgPSB7XG5cbiAgICB1cmw6ICdodHRwOi8vdmhvc3QzLmxudS5zZToyMDA4MC9xdWVzdGlvbi8xJyxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cbn07XG5cbi8vIEZ1bmN0aW9uIGZvciB0aGUgcXVlc3Rpb25zLlxuXG5mdW5jdGlvbiBRdWVzdGlvbnMoaW5wdXQsIGFqYXhDb25maWcpIHtcblxuICAgIC8vIFNldCAyMCBzLlxuXG4gICAgdGhpcy50d2VudHlTZWNvbmRzID0gc2V0VGltZW91dChHYW1lT3ZlciwgMjAwMDApO1xuXG4gICAgLy8gQWRkaW5nIGEgY291bnRkb3duIHRpbWVyLlxuXG4gICAgVGltZXIoKTtcblxuICAgIC8vIEltcG9ydCBxdWVzdGlvbnMgdGVtcGxhdGVcblxuICAgIHRoaXMudGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgdGhpcy5jbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICB0aGlzLnFzdENsb25lID0gdGhpcy5jbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XG4gICAgdGhpcy5xc3RMaXN0Q2xvbmUgPSB0aGlzLmNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbmxpc3QnKTtcbiAgICB0aGlzLmFuc3dlckJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKTtcblxuICAgIGxldCBhbnN3ZXIgPSB7XG4gICAgICAgIGFuc3dlcjogaW5wdXQudmFsdWVcbiAgICB9O1xuXG4gICAgYWpheENvbmZpZyA9IHtcbiAgICAgICAgdXJsOiBjb25maWcudXJsLFxuICAgICAgICBtZXRob2Q6IGNvbmZpZy5tZXRob2QsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBjb25maWcuY29udGVudFR5cGUsXG4gICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkoYW5zd2VyKVxuXG4gICAgfTtcblxuICAgIC8vIE1ha2UgY2FsbCB0byB0aGUgc2VydmVyLlxuXG4gICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgbGV0IHJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlLlxuXG4gICAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgRXJyb3InICsgZXJyb3IpO1xuXG4gICAgICAgICAgICAvL0lmIHNpbmdsZSBhbnN3ZXIuXG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0RGF0YS5hbHRlcm5hdGl2ZXMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvLyBJbXBvcnQgc2luZ2xlIHF1ZXN0aW9uIHRlbXBsYXRlIGFuZCBhcHBlbmQgaXQgdG8gYW5zd2VyYm94LWRpdi5cblxuICAgICAgICAgICAgdGhpcy5hbnN3ZXJCb3guYXBwZW5kQ2hpbGQodGhpcy5xc3RDbG9uZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3REYXRhLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGxldCBxc3RUYWcgPSB0aGlzLnFzdENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xc3QnKTtcbiAgICAgICAgICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBhbnN3ZXJJbnB1dCA9IHRoaXMucXN0Q2xvbmUucXVlcnlTZWxlY3RvcignI2Fuc3dlcicpO1xuICAgICAgICAgICAgbGV0IGFuc3dlckJ1dHRvbiA9IHRoaXMucXN0Q2xvbmUucXVlcnlTZWxlY3RvcignI3N1Ym1pdGFuc3dlcicpO1xuXG4gICAgICAgICAgICAvLyBBZGQgbGlzdGVuZXIgZm9yIGFuc3dlciBpbnB1dC5cblxuICAgICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSAyMCBzIHRvIGdhbWVvdmVyIGNvdW50ZG93bi5cblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnR3ZW50eVNlY29uZHMpO1xuXG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCByZWxvYWQuXG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGFuc3dlcmVkIHF1ZXN0aW9uLlxuXG4gICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJCb3gucmVtb3ZlQ2hpbGQodGhpcy5xc3RDbG9uZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGFyYW1ldGVycyB0byBnZXQgbmV4dCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIGFqYXhDb25maWcudXJsID0gcmVxdWVzdERhdGEubmV4dFVSTDtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgICAgICAgICBsZXQgYW5zd2VyUG9zdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJJbnB1dC52YWx1ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy5hbnN3ZXIgPSBKU09OLnN0cmluZ2lmeShhbnN3ZXJQb3N0KTtcblxuICAgICAgICAgICAgICAgIC8vIFNlbmQgYW5zd2VyIHRvIHNlcnZlciBmb3IgdGhlIG5leHQgcXVlc3Rpb24uXG5cbiAgICAgICAgICAgICAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dFJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcudXJsID0gbmV4dFJlcXVlc3REYXRhLm5leHRVUkw7XG5cbiAgICAgICAgICAgICAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgLy8gSWYgbXVsdGkgY2hvaWNlIGFuc3dlci5cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBJbXBvcnQgbXVsdGkgcXVlc3Rpb24gdGVtcGxhdGUgYW5kIGFwcGVuZCBpdCB0byBhbnN3ZXJib3gtZGl2LlxuXG4gICAgICAgICAgICB0aGlzLmFuc3dlckJveC5hcHBlbmRDaGlsZCh0aGlzLnFzdExpc3RDbG9uZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3REYXRhLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGxldCBxc3RUYWcgPSB0aGlzLnFzdExpc3RDbG9uZS5xdWVyeVNlbGVjdG9yKCcucXN0Jyk7XG4gICAgICAgICAgICBxc3RUYWcuYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgYW5zd2VyTGlzdCA9IHRoaXMucXN0TGlzdENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXJsaXN0Jyk7XG4gICAgICAgICAgICBsZXQgYWx0ZXJuYXRpdmVzID0gcmVxdWVzdERhdGEuYWx0ZXJuYXRpdmVzO1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gYWx0ZXJuYXRpdmVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYlRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgYWx0ZXJuYXRpdmVzW2ldKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgnbmFtZScsIGkpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChiVGFnKTtcblxuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFuc3dlckxpc3QuYXBwZW5kQ2hpbGQobGlzdCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBsaXN0ZW5lciBmb3IgYW5zd2VyIGlucHV0LlxuXG4gICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIDIwIHMgdG8gZ2FtZW92ZXIgY291bnRkb3duLlxuXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudHdlbnR5U2Vjb25kcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHJlbG9hZC5cblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYW5zd2VyZWQgcXVlc3Rpb24uXG5cbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckJveC5yZW1vdmVDaGlsZCh0aGlzLnFzdExpc3RDbG9uZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGFyYW1ldGVycyB0byBnZXQgbmV4dCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIGFqYXhDb25maWcudXJsID0gcmVxdWVzdERhdGEubmV4dFVSTDtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgICAgICAgICBsZXQgYW5zd2VyUG9zdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBlLnRhcmdldC5uYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2VuZCBhbnN3ZXIgdG8gc2VydmVyIGZvciB0aGUgbmV4dCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0UmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBuZXh0UmVxdWVzdERhdGEubmV4dFVSTDtcblxuICAgICAgICAgICAgICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25zO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuZnVuY3Rpb24gVGltZXIoKSB7XG5cbiAgICAvLyBTZXQgdGhlIHRpbWVyIGxlbmd0aC5cblxuICAgIGxldCBzZWNvbmRzID0gMjA7XG5cbiAgICAvLyBJbXBvcnQgdGltZXIgdGVtcGxhdGUuXG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgcXN0Q2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XG4gICAgbGV0IHRpbWVyID0gcXN0Q2xvbmUucXVlcnlTZWxlY3RvcignLnRpbWVyJyk7XG5cbiAgICAvLyBTZXQgaW50ZXJ2YWwgc28gdGhlIHRpbWVyIGNvdW50cyBkb3duIGV2ZXJ5IHNlY29uZC5cblxuICAgIGxldCBjb3VudERvd24gPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblxuICAgICAgICBzZWNvbmRzIC0tO1xuXG4gICAgICAgIHRpbWVyLnRleHRDb250ZW50ID0gc2Vjb25kcztcblxuICAgICAgICBpZiAoc2Vjb25kcyA8PSAwKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50RG93bik7XG4gICAgICAgIH1cbiAgICB9LCAxMDAwKTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZCh0aW1lcik7XG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5sZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5OYW1lKCk7XG5cbiJdfQ==
