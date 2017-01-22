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
