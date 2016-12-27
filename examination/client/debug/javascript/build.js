(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

let Questions = require('./Questions.js');

let saveToStorage = [];

function Name() {

    /*let pTag = document.getElementById('name');
    let text = document.createTextNode('Please write your name here!');
    pTag.appendChild(text);
    let textInput = document.createElement('input');
    pTag.appendChild(textInput);
    let button = document.createElement('button');
    let buttonText = document.createTextNode('Lets Play!');
    button.appendChild(buttonText);
    pTag.appendChild(button);

    button.addEventListener('click', function() {

        while (pTag.hasChildNodes()) {
            pTag.removeChild(pTag.firstChild);
        }
        Questions();
    })*/

    let template = document.querySelector('#name');
    let clone = document.importNode(template.content, true);
    document.querySelector('#answerbox').appendChild(clone);

    let submit = document.querySelector('#submit');
    let input = document.querySelector('#name')

    submit.addEventListener('click', function() {



        Questions();
    })




}





module.exports = Name;

},{"./Questions.js":2}],2:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

function Questions() {

    let req = new XMLHttpRequest();
    req.open('GET', 'http://vhost3.lnu.se:20080/question/1');
    req.setRequestHeader('Content-type', 'application/json');
    req.send();



    req.addEventListener('load', function() {

        let questObj = JSON.parse(req.responseText);
        let textNode = document.createTextNode(questObj.question);
        let pTag = document.querySelector('#questions');
        pTag.appendChild(textNode);

        let reqPost = new XMLHttpRequest();
        let nextUrl = questObj.nextURL;
        reqPost.open('POST', nextUrl);
        reqPost.setRequestHeader('Content-type', 'application/json');

        if (questObj.alternatives) {

        }

        reqPost.send();

    });



}

module.exports = Questions;

},{}],3:[function(require,module,exports){
let Name = require('./Name.js');

Name();

},{"./Name.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGppbW15YmVuZ3Rzc29uIG9uIDIwMTYtMTEtMzAuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgUXVlc3Rpb25zID0gcmVxdWlyZSgnLi9RdWVzdGlvbnMuanMnKTtcblxubGV0IHNhdmVUb1N0b3JhZ2UgPSBbXTtcblxuZnVuY3Rpb24gTmFtZSgpIHtcblxuICAgIC8qbGV0IHBUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZScpO1xuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1BsZWFzZSB3cml0ZSB5b3VyIG5hbWUgaGVyZSEnKTtcbiAgICBwVGFnLmFwcGVuZENoaWxkKHRleHQpO1xuICAgIGxldCB0ZXh0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHBUYWcuYXBwZW5kQ2hpbGQodGV4dElucHV0KTtcbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgbGV0IGJ1dHRvblRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGV0cyBQbGF5IScpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChidXR0b25UZXh0KTtcbiAgICBwVGFnLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB3aGlsZSAocFRhZy5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIHBUYWcucmVtb3ZlQ2hpbGQocFRhZy5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBRdWVzdGlvbnMoKTtcbiAgICB9KSovXG5cbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmFtZScpO1xuICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsb25lKTtcblxuICAgIGxldCBzdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3VibWl0Jyk7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hbWUnKVxuXG4gICAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cblxuXG4gICAgICAgIFF1ZXN0aW9ucygpO1xuICAgIH0pXG5cblxuXG5cbn1cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWU7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9ucygpIHtcblxuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbignR0VUJywgJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnKTtcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZCgpO1xuXG5cblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbGV0IHF1ZXN0T2JqID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgbGV0IHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocXVlc3RPYmoucXVlc3Rpb24pO1xuICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNxdWVzdGlvbnMnKTtcbiAgICAgICAgcFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cbiAgICAgICAgbGV0IHJlcVBvc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgbGV0IG5leHRVcmwgPSBxdWVzdE9iai5uZXh0VVJMO1xuICAgICAgICByZXFQb3N0Lm9wZW4oJ1BPU1QnLCBuZXh0VXJsKTtcbiAgICAgICAgcmVxUG9zdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgICAgIGlmIChxdWVzdE9iai5hbHRlcm5hdGl2ZXMpIHtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmVxUG9zdC5zZW5kKCk7XG5cbiAgICB9KTtcblxuXG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbnM7XG4iLCJsZXQgTmFtZSA9IHJlcXVpcmUoJy4vTmFtZS5qcycpO1xuXG5OYW1lKCk7XG4iXX0=
