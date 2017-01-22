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

