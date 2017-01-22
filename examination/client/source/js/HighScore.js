/**
 * Created by jimmybengtsson on 2016-11-30.
 */

// Module imports.

let Name = require('./Name.js');

function HighScore() {

    // Add highscore template.

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.highscore');
    document.querySelector('#answerbox').appendChild(classClone);

    // Start over button.

    let button = classClone.querySelector('.playagain');

    // Set the end time for the highscore time and calculate total time.

    this.user.end = new Date();
    this.user.total = (this.user.end - this.user.start)/1000;

    // Get the highscore list from storage and if none then add array.
    // Add the sessions name and time to the list and save to storage again.

    let oldList = JSON.parse(localStorage.getItem('highScoreList')) || [];
    oldList.push(this.user);
    localStorage.setItem('highScoreList', JSON.stringify(oldList));

    console.log(this.user);

    // Add listener for reload.

    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;
