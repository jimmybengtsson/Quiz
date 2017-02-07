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

function HighScore() {

    // Add highscore template.

    let highscoreClone = this.clone.querySelector('.highscore');
    this.answerBox.appendChild(highscoreClone);

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

    // Append top 5 to highscore list.

    for (let i = 0; i < oldList.length; i++) {
        let liClone = document.createElement('li');
        liClone.appendChild(document.createTextNode(oldList[i].name + ' - ' + oldList[i].total + 's'));
        highscoreClone.querySelector('.highscoreList').appendChild(liClone);
    }


    // Start over button.

    let button = highscoreClone.querySelector('.playagain');


    // Add listener for reload.

    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;

},{}],4:[function(require,module,exports){
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

let twentySeconds;

// Function for the questions.

function Questions(input, ajaxConfig) {

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

            // Adding a countdown timer.

            Timer();

            // Set 20 s.

            twentySeconds = setTimeout(GameOver, 20000);

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

                window.clearTimeout(twentySeconds);

                // Prevent reload.

                e.preventDefault();

                // Remove the answered question.

                this.answerBox.removeChild(this.qstClone);
                this.answerBox.removeChild(document.querySelector('.timer'));

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

            // Adding a countdown timer.

            Timer();

            // Set 20 s.

            twentySeconds = setTimeout(GameOver, 20000);

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

                window.clearTimeout(twentySeconds);

                // Prevent reload.

                e.preventDefault();

                // Remove the answered question.

                this.answerBox.removeChild(this.qstListClone);
                this.answerBox.removeChild(document.querySelector('.timer'));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQWpheC5qcyIsImNsaWVudC9zb3VyY2UvanMvR2FtZU92ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL0hpZ2hTY29yZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9UaW1lci5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbi8vIE1vZHVsZSBpbXBvcnRzLlxuXG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5sZXQgSGlnaFNjb3JlID0gcmVxdWlyZSgnLi9IaWdoU2NvcmUuanMnKTtcbmxldCBRdWVzdGlvbnMgPSByZXF1aXJlKCcuL1F1ZXN0aW9ucy5qcycpO1xuXG4vLyBBamF4IHJlcXVlc3QgZnVuY3Rpb24uXG5cbmZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnLCBjYWxsYmFjaykge1xuXG4gICAgLy8gUGFyYW1ldGVycyBmb3IgdGhlIGNvbmZpZy5cblxuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbmZpZy5jb250ZW50VHlwZSA9IGNvbmZpZy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24vanNvbic7XG5cbiAgICAvLyBTZW5kIHJlcXVlc3QuXG5cbiAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBBZGQgbGlzdGVuZXIgZm9yIGFuc3dlciBmcm9tIHNlcnZlci5cblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlVGV4dCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgLy8gSWYgZXJyb3IuXG5cbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPiA0MDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlcS5zdGF0dXMpO1xuXG4gICAgICAgICAgICAvLyBHYW1lb3ZlciBpZiB3cm9uZyBhbnN3ZXIuXG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZVRleHQubWVzc2FnZSA9PT0gJ1dyb25nIGFuc3dlciEgOignKSB7XG5cbiAgICAgICAgICAgIEdhbWVPdmVyKCk7XG5cbiAgICAgICAgICAgIC8vIEhpZ2hzY29yZSBpZiBsYXN0IHF1ZXN0aW9uLlxuXG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VUZXh0Lm5leHRVUkwgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBIaWdoU2NvcmUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVxLnJlc3BvbnNlVGV4dCk7XG5cblxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICByZXEub3Blbihjb25maWcubWV0aG9kLCBjb25maWcudXJsKTtcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgY29uZmlnLmNvbnRlbnRUeXBlKTtcblxuICAgIHJlcS5zZW5kKGNvbmZpZy5hbnN3ZXIpO1xuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVxdWVzdDogcmVxdWVzdFxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cblxuZnVuY3Rpb24gR2FtZU92ZXIoKSB7XG5cbiAgICAvLyBBZGQgdGhlIGdhbWVvdmVyIHRlbXBsYXRlLlxuXG4gICAgbGV0IGdhbWVPdmVyQ2xvbmUgPSB0aGlzLmNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5nYW1lb3ZlcicpO1xuICAgIHRoaXMuYW5zd2VyQm94LmFwcGVuZENoaWxkKGdhbWVPdmVyQ2xvbmUpO1xuXG4gICAgLy8gQWRkIGJ1dHRvbiBhbmQgbGlzdGVuZXIgZm9yIHJlbG9hZC5cblxuICAgIGxldCBidXR0b24gPSBnYW1lT3ZlckNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5wbGF5YWdhaW4nKTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuXG4gICAgfSk7XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVPdmVyO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuLy8gTW9kdWxlIGltcG9ydHMuXG5cbmZ1bmN0aW9uIEhpZ2hTY29yZSgpIHtcblxuICAgIC8vIEFkZCBoaWdoc2NvcmUgdGVtcGxhdGUuXG5cbiAgICBsZXQgaGlnaHNjb3JlQ2xvbmUgPSB0aGlzLmNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5oaWdoc2NvcmUnKTtcbiAgICB0aGlzLmFuc3dlckJveC5hcHBlbmRDaGlsZChoaWdoc2NvcmVDbG9uZSk7XG5cbiAgICAvLyBTZXQgdGhlIGVuZCB0aW1lIGZvciB0aGUgaGlnaHNjb3JlIHRpbWUgYW5kIGNhbGN1bGF0ZSB0b3RhbCB0aW1lLlxuXG4gICAgdGhpcy51c2VyLmVuZCA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy51c2VyLnRvdGFsID0gKHRoaXMudXNlci5lbmQgLSB0aGlzLnVzZXIuc3RhcnQpLzEwMDA7XG5cbiAgICAvLyBHZXQgdGhlIGhpZ2hzY29yZSBsaXN0IGZyb20gc3RvcmFnZSBhbmQgaWYgbm9uZSB0aGVuIGFkZCBhcnJheS5cbiAgICAvLyBBZGQgdGhlIHNlc3Npb25zIG5hbWUgYW5kIHRpbWUgdG8gdGhlIGxpc3QgYW5kIHNhdmUgdG8gc3RvcmFnZSBhZ2Fpbi5cblxuICAgIGxldCBvbGRMaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaGlnaFNjb3JlTGlzdCcpKSB8fCBbXTtcblxuICAgIG9sZExpc3QucHVzaCh0aGlzLnVzZXIpO1xuXG4gICAgLy8gU29ydCB0aGUgbGlzdCBhZnRlciB0b3RhbCB0aW1lLlxuXG4gICAgZnVuY3Rpb24gc29ydExpc3QoYSxiKSB7XG4gICAgICAgIGlmIChhLnRvdGFsIDwgYi50b3RhbClcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGEudG90YWwgPiBiLnRvdGFsKVxuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIG9sZExpc3Quc29ydChzb3J0TGlzdCk7XG5cbiAgICAvLyBPbmx5IHRoZSA1IGZhc3Rlc3QgaW4gbGlzdC5cblxuICAgIGlmIChvbGRMaXN0Lmxlbmd0aCA+IDUpIHtcbiAgICAgICAgb2xkTGlzdC5sZW5ndGggPSA1O1xuICAgIH1cblxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdoaWdoU2NvcmVMaXN0JywgSlNPTi5zdHJpbmdpZnkob2xkTGlzdCkpO1xuXG4gICAgLy8gQXBwZW5kIHRvcCA1IHRvIGhpZ2hzY29yZSBsaXN0LlxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvbGRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBsaUNsb25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGlDbG9uZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvbGRMaXN0W2ldLm5hbWUgKyAnIC0gJyArIG9sZExpc3RbaV0udG90YWwgKyAncycpKTtcbiAgICAgICAgaGlnaHNjb3JlQ2xvbmUucXVlcnlTZWxlY3RvcignLmhpZ2hzY29yZUxpc3QnKS5hcHBlbmRDaGlsZChsaUNsb25lKTtcbiAgICB9XG5cblxuICAgIC8vIFN0YXJ0IG92ZXIgYnV0dG9uLlxuXG4gICAgbGV0IGJ1dHRvbiA9IGhpZ2hzY29yZUNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5wbGF5YWdhaW4nKTtcblxuXG4gICAgLy8gQWRkIGxpc3RlbmVyIGZvciByZWxvYWQuXG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcblxuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID1IaWdoU2NvcmU7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4vLyBNb2R1bGUgaW1wb3J0c1xuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxuLy8gQ29uZmlnIGZvciB0aGUgYWpheCBjYWxsXG5cbmxldCBjb25maWcgPSB7XG4gICAgdXJsOiAnaHR0cDovL3Zob3N0My5sbnUuc2U6MjAwODAvcXVlc3Rpb24vMSdcbn07XG5cbi8vIEZ1bmN0aW9uIGZvciBuYW1lIGlucHV0LlxuXG5mdW5jdGlvbiBOYW1lKCkge1xuXG4gICAgLy8gSW1wb3J0IG5hbWUgdGVtcGxhdGVcblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3ggdGVtcGxhdGUnKTtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGxldCBjbGFzc0Nsb25lID0gY2xvbmUucXVlcnlTZWxlY3RvcignLm5hbWUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xhc3NDbG9uZSk7XG5cbiAgICBsZXQgc3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N1Ym1pdCcpO1xuICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0ZXh0Jyk7XG5cbiAgICAvLyBBZGRpbmcgYSB1c2VyIGZvciBoaWdoIHNjb3JlIGxpc3QuXG5cbiAgICB0aGlzLnVzZXIgPSB7XG5cbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIHN0YXJ0OiAnJyxcbiAgICAgICAgZW5kOiAnJyxcbiAgICAgICAgdG90YWw6ICcnLFxuICAgIH07XG5cbiAgICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgLy8gQXNzaWduIG5hbWUgZnJvbSBpbnB1dCBhbmQgc3RhcnQgdGltZS5cblxuICAgICAgICB0aGlzLnVzZXIubmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICB0aGlzLnVzZXIuc3RhcnQgPSBzdGFydFRpbWU7XG5cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLnJlbW92ZUNoaWxkKGNsYXNzQ2xvbmUpO1xuXG4gICAgICAgIC8vIENhbGxpbmcgUXVlc3Rpb25zIGZ1bmN0aW9uLlxuXG4gICAgICAgIFF1ZXN0aW9ucyhjb25maWcpO1xuXG5cbiAgICB9LmJpbmQodGhpcykpO1xuXG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmFtZTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuLy8gTW9kdWxlIGltcG9ydHMuXG5cbmxldCBBamF4ID0gcmVxdWlyZSgnLi9BamF4LmpzJyk7XG5sZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5sZXQgVGltZXIgPSByZXF1aXJlKCcuL1RpbWVyLmpzJyk7XG5cbi8vIEFkZGluZyBwcm9wZXJ0aWVzIHRvIHRoZSBhamF4IGNvbmZpZy5cblxubGV0IGNvbmZpZyA9IHtcblxuICAgIHVybDogJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblxufTtcblxubGV0IHR3ZW50eVNlY29uZHM7XG5cbi8vIEZ1bmN0aW9uIGZvciB0aGUgcXVlc3Rpb25zLlxuXG5mdW5jdGlvbiBRdWVzdGlvbnMoaW5wdXQsIGFqYXhDb25maWcpIHtcblxuICAgIC8vIEltcG9ydCBxdWVzdGlvbnMgdGVtcGxhdGVcblxuICAgIHRoaXMudGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgdGhpcy5jbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICB0aGlzLnFzdENsb25lID0gdGhpcy5jbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XG4gICAgdGhpcy5xc3RMaXN0Q2xvbmUgPSB0aGlzLmNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xdWVzdGlvbmxpc3QnKTtcbiAgICB0aGlzLmFuc3dlckJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKTtcblxuICAgIGxldCBhbnN3ZXIgPSB7XG4gICAgICAgIGFuc3dlcjogaW5wdXQudmFsdWVcbiAgICB9O1xuXG4gICAgYWpheENvbmZpZyA9IHtcbiAgICAgICAgdXJsOiBjb25maWcudXJsLFxuICAgICAgICBtZXRob2Q6IGNvbmZpZy5tZXRob2QsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBjb25maWcuY29udGVudFR5cGUsXG4gICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkoYW5zd2VyKVxuXG4gICAgfTtcblxuICAgIC8vIE1ha2UgY2FsbCB0byB0aGUgc2VydmVyLlxuXG4gICAgQWpheC5yZXF1ZXN0KGFqYXhDb25maWcsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgbGV0IHJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAvLyBFcnJvciBtZXNzYWdlLlxuXG4gICAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgRXJyb3InICsgZXJyb3IpO1xuXG4gICAgICAgICAgICAvL0lmIHNpbmdsZSBhbnN3ZXIuXG5cbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0RGF0YS5hbHRlcm5hdGl2ZXMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvLyBBZGRpbmcgYSBjb3VudGRvd24gdGltZXIuXG5cbiAgICAgICAgICAgIFRpbWVyKCk7XG5cbiAgICAgICAgICAgIC8vIFNldCAyMCBzLlxuXG4gICAgICAgICAgICB0d2VudHlTZWNvbmRzID0gc2V0VGltZW91dChHYW1lT3ZlciwgMjAwMDApO1xuXG4gICAgICAgICAgICAvLyBJbXBvcnQgc2luZ2xlIHF1ZXN0aW9uIHRlbXBsYXRlIGFuZCBhcHBlbmQgaXQgdG8gYW5zd2VyYm94LWRpdi5cblxuICAgICAgICAgICAgdGhpcy5hbnN3ZXJCb3guYXBwZW5kQ2hpbGQodGhpcy5xc3RDbG9uZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3REYXRhLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGxldCBxc3RUYWcgPSB0aGlzLnFzdENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5xc3QnKTtcbiAgICAgICAgICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgICAgIGxldCBhbnN3ZXJJbnB1dCA9IHRoaXMucXN0Q2xvbmUucXVlcnlTZWxlY3RvcignI2Fuc3dlcicpO1xuICAgICAgICAgICAgbGV0IGFuc3dlckJ1dHRvbiA9IHRoaXMucXN0Q2xvbmUucXVlcnlTZWxlY3RvcignI3N1Ym1pdGFuc3dlcicpO1xuXG4gICAgICAgICAgICAvLyBBZGQgbGlzdGVuZXIgZm9yIGFuc3dlciBpbnB1dC5cblxuICAgICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSAyMCBzIHRvIGdhbWVvdmVyIGNvdW50ZG93bi5cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodHdlbnR5U2Vjb25kcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHJlbG9hZC5cblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYW5zd2VyZWQgcXVlc3Rpb24uXG5cbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckJveC5yZW1vdmVDaGlsZCh0aGlzLnFzdENsb25lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckJveC5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGltZXInKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGFyYW1ldGVycyB0byBnZXQgbmV4dCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIGFqYXhDb25maWcudXJsID0gcmVxdWVzdERhdGEubmV4dFVSTDtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgICAgICAgICBsZXQgYW5zd2VyUG9zdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJJbnB1dC52YWx1ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYWpheENvbmZpZy5hbnN3ZXIgPSBKU09OLnN0cmluZ2lmeShhbnN3ZXJQb3N0KTtcblxuICAgICAgICAgICAgICAgIC8vIFNlbmQgYW5zd2VyIHRvIHNlcnZlciBmb3IgdGhlIG5leHQgcXVlc3Rpb24uXG5cbiAgICAgICAgICAgICAgICBBamF4LnJlcXVlc3QoYWpheENvbmZpZywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dFJlcXVlc3REYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcudXJsID0gbmV4dFJlcXVlc3REYXRhLm5leHRVUkw7XG5cbiAgICAgICAgICAgICAgICAgICAgUXVlc3Rpb25zKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgLy8gSWYgbXVsdGkgY2hvaWNlIGFuc3dlci5cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBBZGRpbmcgYSBjb3VudGRvd24gdGltZXIuXG5cbiAgICAgICAgICAgIFRpbWVyKCk7XG5cbiAgICAgICAgICAgIC8vIFNldCAyMCBzLlxuXG4gICAgICAgICAgICB0d2VudHlTZWNvbmRzID0gc2V0VGltZW91dChHYW1lT3ZlciwgMjAwMDApO1xuXG4gICAgICAgICAgICAvLyBJbXBvcnQgbXVsdGkgcXVlc3Rpb24gdGVtcGxhdGUgYW5kIGFwcGVuZCBpdCB0byBhbnN3ZXJib3gtZGl2LlxuXG4gICAgICAgICAgICB0aGlzLmFuc3dlckJveC5hcHBlbmRDaGlsZCh0aGlzLnFzdExpc3RDbG9uZSk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3REYXRhLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIGxldCBxc3RUYWcgPSB0aGlzLnFzdExpc3RDbG9uZS5xdWVyeVNlbGVjdG9yKCcucXN0Jyk7XG4gICAgICAgICAgICBxc3RUYWcuYXBwZW5kQ2hpbGQodGV4dE5vZGUpO1xuXG4gICAgICAgICAgICBsZXQgYW5zd2VyTGlzdCA9IHRoaXMucXN0TGlzdENsb25lLnF1ZXJ5U2VsZWN0b3IoJy5hbnN3ZXJsaXN0Jyk7XG4gICAgICAgICAgICBsZXQgYWx0ZXJuYXRpdmVzID0gcmVxdWVzdERhdGEuYWx0ZXJuYXRpdmVzO1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gYWx0ZXJuYXRpdmVzKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYlRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgYlRhZy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgYWx0ZXJuYXRpdmVzW2ldKTtcbiAgICAgICAgICAgICAgICBiVGFnLnNldEF0dHJpYnV0ZSgnbmFtZScsIGkpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChiVGFnKTtcblxuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFuc3dlckxpc3QuYXBwZW5kQ2hpbGQobGlzdCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBsaXN0ZW5lciBmb3IgYW5zd2VyIGlucHV0LlxuXG4gICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIDIwIHMgdG8gZ2FtZW92ZXIgY291bnRkb3duLlxuXG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0d2VudHlTZWNvbmRzKTtcblxuICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgcmVsb2FkLlxuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBhbnN3ZXJlZCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQm94LnJlbW92ZUNoaWxkKHRoaXMucXN0TGlzdENsb25lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckJveC5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGltZXInKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgcGFyYW1ldGVycyB0byBnZXQgbmV4dCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIGFqYXhDb25maWcudXJsID0gcmVxdWVzdERhdGEubmV4dFVSTDtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgICAgICAgICBsZXQgYW5zd2VyUG9zdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBlLnRhcmdldC5uYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBhamF4Q29uZmlnLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KGFuc3dlclBvc3QpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2VuZCBhbnN3ZXIgdG8gc2VydmVyIGZvciB0aGUgbmV4dCBxdWVzdGlvbi5cblxuICAgICAgICAgICAgICAgIEFqYXgucmVxdWVzdChhamF4Q29uZmlnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0UmVxdWVzdERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBuZXh0UmVxdWVzdERhdGEubmV4dFVSTDtcblxuICAgICAgICAgICAgICAgICAgICBRdWVzdGlvbnMoY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25zO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuZnVuY3Rpb24gVGltZXIoKSB7XG5cbiAgICAvLyBTZXQgdGhlIHRpbWVyIGxlbmd0aC5cblxuICAgIGxldCBzZWNvbmRzID0gMjA7XG5cbiAgICAvLyBJbXBvcnQgdGltZXIgdGVtcGxhdGUuXG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94IHRlbXBsYXRlJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBsZXQgcXN0Q2xvbmUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XG4gICAgbGV0IHRpbWVyID0gcXN0Q2xvbmUucXVlcnlTZWxlY3RvcignLnRpbWVyJyk7XG5cbiAgICAvLyBTZXQgaW50ZXJ2YWwgc28gdGhlIHRpbWVyIGNvdW50cyBkb3duIGV2ZXJ5IHNlY29uZC5cblxuICAgIGxldCBjb3VudERvd24gPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblxuICAgICAgICBzZWNvbmRzIC0tO1xuXG4gICAgICAgIHRpbWVyLnRleHRDb250ZW50ID0gc2Vjb25kcztcblxuICAgICAgICBpZiAoc2Vjb25kcyA8PSAwKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50RG93bik7XG4gICAgICAgIH1cbiAgICB9LCAxMDAwKTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhbnN3ZXJib3gnKS5hcHBlbmRDaGlsZCh0aW1lcik7XG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG5sZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5OYW1lKCk7XG5cbiJdfQ==
