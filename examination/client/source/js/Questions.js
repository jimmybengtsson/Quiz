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
