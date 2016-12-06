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
