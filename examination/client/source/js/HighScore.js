/**
 * Created by jimmybengtsson on 2016-11-30.
 */

// Module imports.

let Name = require('./Name.js');

function HighScore() {

    while (this.answerBox.firstChild) {
        this.answerBox.removeChild(this.answerBox.firstChild);
    }

    // Add highscore template.

    let highscoreClone = this.clone.querySelector('.highscore');
    this.answerBox.appendChild(highscoreClone);

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

    // Append top 5 to highscore list.

    for (let i = 0; i < oldList.length; i++) {
        let liClone = document.createElement('li');
        liClone.appendChild(document.createTextNode(oldList[i].name + ' - ' + oldList[i].total + 's'));
        highscoreClone.querySelector('.highscoreList').appendChild(liClone);
    }


    // Start over button.

    let button = highscoreClone.querySelector('.playagain');


    // Add listener for reload.

    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;
