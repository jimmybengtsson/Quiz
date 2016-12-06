/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

let saveToStorage = [];

function Name() {

    let nameTemplate = document.querySelector('#name');
    let nameClone = document.importNode(nameTemplate.content, true);

    nameClone.addEventListener('load', function() {

        let newTag = document.createElement('p');
        let newText = document.createTextNode('Test');

        newTag.appendChild(newText);

        nameClone.appendChild(newTag);

        document.querySelector('#answerbox').appendChild(newTag);

    });
}

module.exports = Name;
