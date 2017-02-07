/**
 * Created by jimmybengtsson on 2016-11-30.
 */


function GameOver() {

    // Add the gameover template.

    let gameOverClone = this.clone.querySelector('.gameover');
    this.answerBox.appendChild(gameOverClone);

    // Add button and listener for reload.

    let button = gameOverClone.querySelector('.playagain');

    button.addEventListener('click', function() {

        location.reload();

    });


}

module.exports = GameOver;
