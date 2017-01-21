/**
 * Created by jimmybengtsson on 2016-11-30.
 */

let Name = require('./Name.js');


function HighScore() {

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.highscore');
    document.querySelector('#answerbox').appendChild(classClone);

    let button = classClone.querySelector('.playagain');

    this.user.end = new Date();
    this.user.total = (this.user.end - this.user.start)/1000;

    let oldList = JSON.parse(localStorage.getItem('highScoreList')) || [];
    oldList.push(this.user);
    localStorage.setItem('highScoreList', JSON.stringify(oldList));



    console.log(this.user);



    button.addEventListener('click', function() {

        location.reload();

    });

}

module.exports =HighScore;
