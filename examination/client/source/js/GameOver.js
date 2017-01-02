/**
 * Created by jimmybengtsson on 2016-11-30.
 */

function GameOver() {

    let template = document.querySelector('#gameover');
    let clone = document.importNode(template.content, true);
    document.querySelector('#answerbox').appendChild(clone);

    let button = document.querySelector('#playagain');

    button.addEventListener('click', function() {

        location.reload();

    });


}

module.exports = GameOver;
