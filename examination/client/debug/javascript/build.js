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

            // Highscore of last question.

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

    // Start over button.

    let button = classClone.querySelector('.playagain');

    // Set the end time for the highscore time and calculate total time.

    this.user.end = new Date();
    this.user.total = (this.user.end - this.user.start)/1000;

    // Get the highscore list from storage and if none then add array.
    // Add the sessions name and time to the list and save to storage again.

    let oldList = JSON.parse(localStorage.getItem('highScoreList')) || [];
    oldList.push(this.user);
    localStorage.setItem('highScoreList', JSON.stringify(oldList));

    console.log(this.user);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL0hpZ2hTY29yZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9UaW1lci5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbi8vIE1vZHVsZSBpbXBvcnRzLlxuXG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5sZXQgSGlnaFNjb3JlID0gcmVxdWlyZSgnLi9IaWdoU2NvcmUuanMnKTtcbmxldCBRdWVzdGlvbnMgPSByZXF1aXJlKCcuL1F1ZXN0aW9ucy5qcycpO1xuXG4vLyBBamF4IHJlcXVlc3QgZnVuY3Rpb24uXG5cbmZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnLCBjYWxsYmFjaykge1xuXG4gICAgLy8gUGFyYW1ldGVycyBmb3IgdGhlIGNvbmZpZy5cblxuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbmZpZy5jb250ZW50VHlwZSA9IGNvbmZpZy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24vanNvbic7XG5cbiAgICAvLyBTZW5kIHJlcXVlc3QuXG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBBZGQgbGlzdGVuZXIgZm9yIGFuc3dlciBmcm9tIHNlcnZlci5cblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlVGV4dCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgLy8gSWYgZXJyb3IuXG5cbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPiA0MDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMpO1xuXG4gICAgICAgICAgICAvLyBHYW1lb3ZlciBpZiB3cm9uZyBhbnN3ZXIuXG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZVRleHQubWVzc2FnZSA9PT0gJ1dyb25nIGFuc3dlciEgOignKSB7XG5cbiAgICAgICAgICAgIEdhbWVPdmVyKCk7XG5cbiAgICAgICAgICAgIC8vIEhpZ2hzY29yZSBvZiBsYXN0IHF1ZXN0aW9uLlxuXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VUZXh0Lm5leHRVUkwgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBIaWdoU2NvcmUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVxLnJlc3BvbnNlVGV4dCk7XG5cblxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICByZXEub3Blbihjb25maWcubWV0aG9kLCBjb25maWcudXJsKTtcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgY29uZmlnLmNvbnRlbnRUeXBlKTtcblxuICAgIHJlcS5zZW5kKGNvbmZpZy5hbnN3ZXIpO1xuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cblxuZnVuY3Rpb24gR2FtZU92ZXIoKSB7XG5cbiAgICAvLyBSZW1vdmUgbm9kZXMgZnJvbSBhbnN3ZXJib3gtZGl2IGlmIHRoZXJlIGlzIGFueS5cblxuICAgIHdoaWxlICh0aGlzLmFuc3dlckJveC5maXJzdENoaWxkKSB7XG4gICAgICAgIHRoaXMuYW5zd2VyQm94LnJlbW92ZUNoaWxkKHRoaXMuYW5zd2VyQm94LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZ2FtZW92ZXIgdGVtcGxhdGUuXG5cbiAgICBsZXQgZ2FtZU92ZXJDbG9uZSA9IHRoaXMuY2xvbmUucXVlcnlTZWxlY3RvcignLmdhbWVvdmVyJyk7XG4gICAgdGhpcy5hbnN3ZXJCb3guYXBwZW5kQ2hpbGQoZ2FtZU92ZXJDbG9uZSk7XG5cbiAgICAvLyBBZGQgYnV0dG9uIGFuZCBsaXN0ZW5lciBmb3IgcmVsb2FkLlxuXG4gICAgbGV0IGJ1dHRvbiA9IGdhbWVPdmVyQ2xvbmUucXVlcnlTZWxlY3RvcignLnBsYXlhZ2FpbicpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICB9KTtcblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU92ZXI7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4vLyBNb2R1bGUgaW1wb3J0cy5cblxubGV0IE5hbWUgPSByZXF1aXJlKCcuL05hbWUuanMnKTtcblxuZnVuY3Rpb24gSGlnaFNjb3JlKCkge1xuXG4gICAgLy8gQWRkIGhpZ2hzY29yZSB0ZW1wbGF0ZS5cblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLmhpZ2hzY29yZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZChjbGFzc0Nsb25lKTtcblxuICAgIC8vIFN0YXJ0IG92ZXIgYnV0dG9uLlxuXG4gICAgbGV0IGJ1dHRvbiA9IGNsYXNzQ2xvbmUucXVlcnlTZWxlY3RvcignLnBsYXlhZ2FpbicpO1xuXG4gICAgLy8gU2V0IHRoZSBlbmQgdGltZSBmb3IgdGhlIGhpZ2hzY29yZSB0aW1lIGFuZCBjYWxjdWxhdGUgdG90YWwgdGltZS5cblxuICAgIHRoaXMudXNlci5lbmQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMudXNlci50b3RhbCA9ICh0aGlzLnVzZXIuZW5kIC0gdGhpcy51c2VyLnN0YXJ0KS8xMDAwO1xuXG4gICAgLy8gR2V0IHRoZSBoaWdoc2NvcmUgbGlzdCBmcm9tIHN0b3JhZ2UgYW5kIGlmIG5vbmUgdGhlbiBhZGQgYXJyYXkuXG4gICAgLy8gQWRkIHRoZSBzZXNzaW9ucyBuYW1lIGFuZCB0aW1lIHRvIHRoZSBsaXN0IGFuZCBzYXZlIHRvIHN0b3JhZ2UgYWdhaW4uXG5cbiAgICBsZXQgb2xkTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZ2hTY29yZUxpc3QnKSkgfHwgW107XG4gICAgb2xkTGlzdC5wdXNoKHRoaXMudXNlcik7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2hpZ2hTY29yZUxpc3QnLCBKU09OLnN0cmluZ2lmeShvbGRMaXN0KSk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLnVzZXIpO1xuXG4gICAgLy8gQWRkIGxpc3RlbmVyIGZvciByZWxvYWQuXG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcblxuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID1IaWdoU2NvcmU7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4vLyBNb2R1bGUgaW1wb3J0c1xuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxuLy8gQ29uZmlnIGZvciB0aGUgYWpheCBjYWxsXG5cbmxldCBjb25maWcgPSB7XG4gICAgdXJsOiAnaHR0cDovL3Zob3N0My5sbnUuc2U6MjAwODAvcXVlc3Rpb24vMSdcbn07XG5cbi8vIEZ1bmN0aW9uIGZvciBuYW1lIGlucHV0LlxuXG5mdW5jdGlvbiBOYW1lKCkge1xuXG4gICAgLy8gSW1wb3J0IG5hbWUgdGVtcGxhdGVcblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLm5hbWUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICBsZXQgc3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N1Ym1pdCcpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZXh0Jyk7XG5cbiAgICAvLyBBZGRpbmcgYSB1c2VyIGZvciBoaWdoIHNjb3JlIGxpc3QuXG5cbiAgICB0aGlzLnVzZXIgPSB7XG5cbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIHN0YXJ0OiAnJyxcbiAgICAgICAgZW5kOiAnJyxcbiAgICAgICAgdG90YWw6ICcnLFxuICAgIH07XG5cbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgLy8gQXNzaWduIG5hbWUgZnJvbSBpbnB1dCBhbmQgc3RhcnQgdGltZS5cblxuICAgICAgICB0aGlzLnVzZXIubmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICB0aGlzLnVzZXIuc3RhcnQgPSBzdGFydFRpbWU7XG5cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgIC8vIENhbGxpbmcgUXVlc3Rpb25zIGZ1bmN0aW9uLlxuXG4gICAgICAgIFF1ZXN0aW9ucyhjb25maWcpO1xuXG5cbiAgICB9LmJpbmQodGhpcykpO1xuXG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmFtZTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuLy8gTW9kdWxlIGltcG9ydHMuXG5cbmxldCBBamF4ID0gcmVxdWlyZSgnLi9BamF4LmpzJyk7XG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5sZXQgVGltZXIgPSByZXF1aXJlKCcuL1RpbWVyLmpzJyk7XG5cbi8vIEFkZGluZyBwcm9wZXJ0aWVzIHRvIHRoZSBhamF4IGNvbmZpZy5cblxubGV0IGNvbmZpZyA9IHtcblxuICAgIHVybDogJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblxufTtcblxuLy8gRnVuY3Rpb24gZm9yIHRoZSBxdWVzdGlvbnMuXG5cbmZ1bmN0aW9uIFF1ZXN0aW9ucyhpbnB1dCwgYWpheENvbmZpZykge1xuXG4gICAgLy8gU2V0IDIwIHMuXG5cbiAgICB0aGlzLnR3ZW50eVNlY29uZHMgPSBzZXRUaW1lb3V0KEdhbWVPdmVyLCAyMDAwMCk7XG5cbiAgICAvLyBBZGRpbmcgYSBjb3VudGRvd24gdGltZXIuXG5cbiAgICBUaW1lcigpO1xuXG4gICAgLy8gSW1wb3J0IHF1ZXN0aW9ucyB0ZW1wbGF0ZVxuXG4gICAgdGhpcy50ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICB0aGlzLmNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIHRoaXMucXN0Q2xvbmUgPSB0aGlzLmNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbiAgICB0aGlzLnFzdExpc3RDbG9uZSA9IHRoaXMuY2xvbmUucXVlcnlTZWxlY3RvcignLnF1ZXN0aW9ubGlzdCcpO1xuICAgIHRoaXMuYW5zd2VyQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpO1xuXG4gICAgbGV0IGFuc3dlciA9IHtcbiAgICAgICAgYW5zd2VyOiBpbnB1dC52YWx1ZVxuICAgIH07XG5cbiAgICBhamF4Q29uZmlnID0ge1xuICAgICAgICB1cmw6IGNvbmZpZy51cmwsXG4gICAgICAgIG1ldGhvZDogY29uZmlnLm1ldGhvZCxcbiAgICAgICAgY29udGVudFR5cGU6IGNvbmZpZy5jb250ZW50VHlwZSxcbiAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeShhbnN3ZXIpXG5cbiAgICB9O1xuXG4gICAgLy8gTWFrZSBjYWxsIHRvIHRoZSBzZXJ2ZXIuXG5cbiAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICBsZXQgcmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgIC8vIEVycm9yIG1lc3NhZ2UuXG5cbiAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmV0d29yayBFcnJvcicgKyBlcnJvcik7XG5cbiAgICAgICAgICAgIC8vSWYgc2luZ2xlIGFuc3dlci5cblxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3REYXRhLmFsdGVybmF0aXZlcyA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vIEltcG9ydCBzaW5nbGUgcXVlc3Rpb24gdGVtcGxhdGUgYW5kIGFwcGVuZCBpdCB0byBhbnN3ZXJib3gtZGl2LlxuXG4gICAgICAgICAgICB0aGlzLmFuc3dlckJveC5hcHBlbmRDaGlsZCh0aGlzLnFzdENsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IHRoaXMucXN0Q2xvbmUucXVlcnlTZWxlY3RvcignLnFzdCcpO1xuICAgICAgICAgICAgcXN0VGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICAgICAgICAgbGV0IGFuc3dlcklucHV0ID0gdGhpcy5xc3RDbG9uZS5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyJyk7XG4gICAgICAgICAgICBsZXQgYW5zd2VyQnV0dG9uID0gdGhpcy5xc3RDbG9uZS5xdWVyeVNlbGVjdG9yKCcjc3VibWl0YW5zd2VyJyk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBsaXN0ZW5lciBmb3IgYW5zd2VyIGlucHV0LlxuXG4gICAgICAgICAgICBhbnN3ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIDIwIHMgdG8gZ2FtZW92ZXIgY291bnRkb3duLlxuXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudHdlbnR5U2Vjb25kcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHJlbG9hZC5cblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYW5zd2VyZWQgcXVlc3Rpb24uXG5cbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckJveC5yZW1vdmVDaGlsZCh0aGlzLnFzdENsb25lKTtcblxuICAgICAgICAgICAgICAgIC8vIENoYW5nZSBwYXJhbWV0ZXJzIHRvIGdldCBuZXh0IHF1ZXN0aW9uLlxuXG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy51cmwgPSByZXF1ZXN0RGF0YS5uZXh0VVJMO1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJQb3N0ID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcklucHV0LnZhbHVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2VuZCBhbnN3ZXIgdG8gc2VydmVyIGZvciB0aGUgbmV4dCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0UmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBuZXh0UmVxdWVzdERhdGEubmV4dFVSTDtcblxuICAgICAgICAgICAgICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICAvLyBJZiBtdWx0aSBjaG9pY2UgYW5zd2VyLlxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIEltcG9ydCBtdWx0aSBxdWVzdGlvbiB0ZW1wbGF0ZSBhbmQgYXBwZW5kIGl0IHRvIGFuc3dlcmJveC1kaXYuXG5cbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQm94LmFwcGVuZENoaWxkKHRoaXMucXN0TGlzdENsb25lKTtcblxuICAgICAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVxdWVzdERhdGEucXVlc3Rpb24pO1xuICAgICAgICAgICAgbGV0IHFzdFRhZyA9IHRoaXMucXN0TGlzdENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xc3QnKTtcbiAgICAgICAgICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBhbnN3ZXJMaXN0ID0gdGhpcy5xc3RMaXN0Q2xvbmUucXVlcnlTZWxlY3RvcignLmFuc3dlcmxpc3QnKTtcbiAgICAgICAgICAgIGxldCBhbHRlcm5hdGl2ZXMgPSByZXF1ZXN0RGF0YS5hbHRlcm5hdGl2ZXM7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBhbHRlcm5hdGl2ZXMpIHtcblxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcblxuICAgICAgICAgICAgICAgIGxldCBiVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBhbHRlcm5hdGl2ZXNbaV0pO1xuICAgICAgICAgICAgICAgIGJUYWcuc2V0QXR0cmlidXRlKCduYW1lJywgaSk7XG5cbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGJUYWcpO1xuXG4gICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYW5zd2VyTGlzdC5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgICAgICAgICAgLy8gQWRkIGxpc3RlbmVyIGZvciBhbnN3ZXIgaW5wdXQuXG5cbiAgICAgICAgICAgIGFuc3dlckxpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgMjAgcyB0byBnYW1lb3ZlciBjb3VudGRvd24uXG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50d2VudHlTZWNvbmRzKTtcblxuICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgcmVsb2FkLlxuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBhbnN3ZXJlZCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQm94LnJlbW92ZUNoaWxkKHRoaXMucXN0TGlzdENsb25lKTtcblxuICAgICAgICAgICAgICAgIC8vIENoYW5nZSBwYXJhbWV0ZXJzIHRvIGdldCBuZXh0IHF1ZXN0aW9uLlxuXG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy51cmwgPSByZXF1ZXN0RGF0YS5uZXh0VVJMO1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJQb3N0ID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGUudGFyZ2V0Lm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFqYXhDb25maWcuYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkoYW5zd2VyUG9zdCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTZW5kIGFuc3dlciB0byBzZXJ2ZXIgZm9yIHRoZSBuZXh0IHF1ZXN0aW9uLlxuXG4gICAgICAgICAgICAgICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRSZXF1ZXN0RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnVybCA9IG5leHRSZXF1ZXN0RGF0YS5uZXh0VVJMO1xuXG4gICAgICAgICAgICAgICAgICAgIFF1ZXN0aW9ucyhjb25maWcpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbnM7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5mdW5jdGlvbiBUaW1lcigpIHtcblxuICAgIC8vIFNldCB0aGUgdGltZXIgbGVuZ3RoLlxuXG4gICAgbGV0IHNlY29uZHMgPSAyMDtcblxuICAgIC8vIEltcG9ydCB0aW1lciB0ZW1wbGF0ZS5cblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBxc3RDbG9uZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbnMnKTtcbiAgICBsZXQgdGltZXIgPSBxc3RDbG9uZS5xdWVyeVNlbGVjdG9yKCcudGltZXInKTtcblxuICAgIC8vIFNldCBpbnRlcnZhbCBzbyB0aGUgdGltZXIgY291bnRzIGRvd24gZXZlcnkgc2Vjb25kLlxuXG4gICAgbGV0IGNvdW50RG93biA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHNlY29uZHMgLS07XG5cbiAgICAgICAgdGltZXIudGV4dENvbnRlbnQgPSBzZWNvbmRzO1xuXG4gICAgICAgIGlmIChzZWNvbmRzIDw9IDApIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY291bnREb3duKTtcbiAgICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKHRpbWVyKTtcblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbmxldCBOYW1lID0gcmVxdWlyZSgnLi9OYW1lLmpzJyk7XG5cbk5hbWUoKTtcblxuIl19
