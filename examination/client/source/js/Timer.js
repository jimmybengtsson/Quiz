/**
 * Created by jimmybengtsson on 2016-11-30.
 */

function Timer() {

    // Set the timer length.

    let seconds = 20;

    // Import timer template.

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let qstClone = clone.querySelector('.questions');
    let timer = qstClone.querySelector('.timer');

    // Set interval so the timer counts down every second.

    let countDown = setInterval(function() {

        seconds --;

        timer.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(countDown);
        }
    }, 1000);

    document.querySelector('#answerbox').appendChild(timer);



}

module.exports = Timer;
