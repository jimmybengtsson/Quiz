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
    let input = document.querySelector('#name');

    submit.addEventListener('click', function(startQst) {

        startQst.preventDefault();

        while (document.querySelector('#answerbox').hasChildNodes()) {
            document.querySelector('#answerbox').removeChild(document.querySelector('#answerbox').firstChild);
        }


        Questions();


    });




}





module.exports = Name;


},{"./Questions.js":2}],2:[function(require,module,exports){
/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

function Questions() {

    let template = document.querySelector('#questions');
    let clone = document.importNode(template.content, true);
    document.querySelector('#answerbox').appendChild(clone);

    let req = new XMLHttpRequest();
    req.open('GET', 'http://vhost3.lnu.se:20080/question/1');
    req.setRequestHeader('Content-type', 'application/json');
    req.send();

    let questObj = JSON.parse(req.responseText);
    let textNode = document.createTextNode(questObj.question);

    let qstTag = document.querySelector('#qst');
    qstTag.appendChild(textNode);



    /* req.addEventListener('load', function() {

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

     });*/



}

module.exports = Questions;

},{}],3:[function(require,module,exports){
let Name = require('./Name.js');

Name();

/*let GameOver = require('./GameOver.js');

GameOver();


let Questions = require('./Questions.js');

Questions();
*/

},{"./Name.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmFtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvUXVlc3Rpb25zLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgamltbXliZW5ndHNzb24gb24gMjAxNi0xMS0zMC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmxldCBRdWVzdGlvbnMgPSByZXF1aXJlKCcuL1F1ZXN0aW9ucy5qcycpO1xuXG5sZXQgc2F2ZVRvU3RvcmFnZSA9IFtdO1xuXG5mdW5jdGlvbiBOYW1lKCkge1xuXG4gICAgLypsZXQgcFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lJyk7XG4gICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1BsZWFzZSB3cml0ZSB5b3VyIG5hbWUgaGVyZSEnKTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgbGV0IHRleHRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgIHBUYWcuYXBwZW5kQ2hpbGQodGV4dElucHV0KTtcbiAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICBsZXQgYnV0dG9uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMZXRzIFBsYXkhJyk7XG4gICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChidXR0b25UZXh0KTtcbiAgICAgcFRhZy5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgIHdoaWxlIChwVGFnLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICBwVGFnLnJlbW92ZUNoaWxkKHBUYWcuZmlyc3RDaGlsZCk7XG4gICAgIH1cbiAgICAgUXVlc3Rpb25zKCk7XG4gICAgIH0pKi9cblxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYW1lJyk7XG4gICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuXG4gICAgbGV0IHN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQnKTtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmFtZScpO1xuXG4gICAgc3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oc3RhcnRRc3QpIHtcblxuICAgICAgICBzdGFydFFzdC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHdoaWxlIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYW5zd2VyYm94JykucmVtb3ZlQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG5cblxuICAgICAgICBRdWVzdGlvbnMoKTtcblxuXG4gICAgfSk7XG5cblxuXG5cbn1cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWU7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBqaW1teWJlbmd0c3NvbiBvbiAyMDE2LTExLTMwLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gUXVlc3Rpb25zKCkge1xuXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3F1ZXN0aW9ucycpO1xuICAgIGxldCBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Fuc3dlcmJveCcpLmFwcGVuZENoaWxkKGNsb25lKTtcblxuICAgIGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbignR0VUJywgJ2h0dHA6Ly92aG9zdDMubG51LnNlOjIwMDgwL3F1ZXN0aW9uLzEnKTtcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZCgpO1xuXG4gICAgbGV0IHF1ZXN0T2JqID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShxdWVzdE9iai5xdWVzdGlvbik7XG5cbiAgICBsZXQgcXN0VGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3FzdCcpO1xuICAgIHFzdFRhZy5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG5cblxuXG4gICAgLyogcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcblxuICAgICBsZXQgcXVlc3RPYmogPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICBsZXQgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShxdWVzdE9iai5xdWVzdGlvbik7XG4gICAgIGxldCBwVGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3F1ZXN0aW9ucycpO1xuICAgICBwVGFnLmFwcGVuZENoaWxkKHRleHROb2RlKTtcblxuICAgICBsZXQgcmVxUG9zdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICBsZXQgbmV4dFVybCA9IHF1ZXN0T2JqLm5leHRVUkw7XG4gICAgIHJlcVBvc3Qub3BlbignUE9TVCcsIG5leHRVcmwpO1xuICAgICByZXFQb3N0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgICAgaWYgKHF1ZXN0T2JqLmFsdGVybmF0aXZlcykge1xuXG4gICAgIH1cblxuICAgICByZXFQb3N0LnNlbmQoKTtcblxuICAgICB9KTsqL1xuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9ucztcbiIsImxldCBOYW1lID0gcmVxdWlyZSgnLi9OYW1lLmpzJyk7XG5cbk5hbWUoKTtcblxuLypsZXQgR2FtZU92ZXIgPSByZXF1aXJlKCcuL0dhbWVPdmVyLmpzJyk7XG5cbkdhbWVPdmVyKCk7XG5cblxubGV0IFF1ZXN0aW9ucyA9IHJlcXVpcmUoJy4vUXVlc3Rpb25zLmpzJyk7XG5cblF1ZXN0aW9ucygpO1xuKi9cbiJdfQ==
