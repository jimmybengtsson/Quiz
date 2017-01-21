/**
 * Created by jimmybengtsson on 2016-11-30.
 */


function GameOver() {

    while (this.answerBox.firstChild) {
        this.answerBox.removeChild(this.answerBox.firstChild);
    }

    let gameOverClone = this.clone.querySelector('.gameover');
    this.answerBox.appendChild(gameOverClone);

    let button = gameOverClone.querySelector('.playagain');

    button.addEventListener('click', function() {

        location.reload();

    });


}

module.exports = GameOver;
