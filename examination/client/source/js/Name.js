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

