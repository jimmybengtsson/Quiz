
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
