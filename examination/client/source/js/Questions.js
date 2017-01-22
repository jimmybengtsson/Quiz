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
