/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

let Questions = require('./Questions.js');

let saveToStorage = [];

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

    let template = document.querySelector('#name');
    let clone = document.importNode(template.content, true);
    document.querySelector('#answerbox').appendChild(clone);

    let submit = document.querySelector('#submit');
    let input = document.querySelector('#name');

    submit.addEventListener('click', function(startQst) {

        startQst.preventDefault();

        while (document.querySelector('#answerbox').hasChildNodes()) {
            document.querySelector('#answerbox').removeChild(document.querySelector('#answerbox').firstChild);
        }


        Questions();


    });




}





module.exports = Name;

