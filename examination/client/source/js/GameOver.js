/**
 * Created by jimmybengtsson on 2016-11-30.
 */


function GameOver() {

    // Remove nodes from answerbox-div if there is any.

    while (this.answerBox.firstChild) {
        this.answerBox.removeChild(this.answerBox.firstChild);
    }

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
