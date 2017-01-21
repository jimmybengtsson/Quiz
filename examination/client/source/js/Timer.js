/**
 * Created by jimmybengtsson on 2016-11-30.
 */

function Timer() {

    let seconds = 20;

    let template = document.querySelector('#answerbox template');
    let clone = document.importNode(template.content, true);
    let qstClone = clone.querySelector('.questions');
    let timer = qstClone.querySelector('.timer');



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
