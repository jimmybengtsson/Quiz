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

    // Set the end time for the highscore time and calculate total time.

    this.user.end = new Date();
    this.user.total = (this.user.end - this.user.start)/1000;

    // Get the highscore list from storage and if none then add array.
    // Add the sessions name and time to the list and save to storage again.

    let oldList = JSON.parse(localStorage.getItem('highScoreList')) || [];

    oldList.push(this.user);

    // Sort the list after total time.

    function sortList(a,b) {
        if (a.total < b.total)
            return -1;
        if (a.total > b.total)
            return 1;
        return 0;
    }

    oldList.sort(sortList);

    // Only the 5 fastest in list.

    if (oldList.length > 5) {
        oldList.length = 5;
    }

    localStorage.setItem('highScoreList', JSON.stringify(oldList));

    for (let i = 0; i < oldList.length; i++) {
        let liClone = document.createElement('li');
        liClone.appendChild(document.createTextNode(oldList[i].name + ' - ' + oldList[i].total + 's'));
        classClone.querySelector('.highscoreList').appendChild(liClone);

    }

    console.log(oldList);

    // Start over button.

    let button = classClone.querySelector('.playagain');


    // Add listener for reload.

    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;
