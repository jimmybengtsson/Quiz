/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

let GameOver = require('./GameOver.js');

function Questions(config) {

    let req = new XMLHttpRequest();
    req.open('GET', config.url);
    req.setRequestHeader('Content-type', 'application/json');
    req.send();

    req.addEventListener('load', function() {

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

                document.querySelector('#answerbox').removeChild(classClone);

                questObj = JSON.parse(reqPost.responseText);

                if (questObj.message === 'Wrong answer! :(') {

                    GameOver();

                } else {

                    if ()
                }





            });
        });

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
