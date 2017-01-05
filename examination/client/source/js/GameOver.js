/**
 * Created by jimmybengtsson on 2016-11-30.
 */

function GameOver() {

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let classClone = clone.querySelector('.gameover');
    document.querySelector('#answerbox').appendChild(classClone);

    let button = classClone.querySelector('.playagain');

    button.addEventListener('click', function() {

        location.reload();

    });


}

module.exports = GameOver;
