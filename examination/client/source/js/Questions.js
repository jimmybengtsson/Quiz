/**
 * Created by jimmybengtsson on 2016-11-30.
 */

'use strict';

function Questions() {

    let req = new XMLHttpRequest();
    req.addEventListener('load', function() {

        let questObj = req.responseXML;
        let question = '';
        let x = questObj.getElementsByTagName('QUESTION');
        for (let i = 0; i < x.length; i++) {
            question += x[i].childNodes[0].nodeValue
        }
        document.getElementById('questions') = question;

    });

    let data = null;
    req.open('GET', 'http://vhost3.lnu.se:20080/question/1');
    req.setRequestHeader('Content-type', 'application/json')
    req.send(data);
}

module.exports = Questions;
