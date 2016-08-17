/**
 * Created by sfabini on 8/17/16.
 */
'use strict';

var express = require('express'); // do not change this line
var app = express();
var path = require('path');
console.log(__dirname + '/index.html');

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    var options = {
        root: __dirname,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.set('Content-Type', 'text/html');
    res.status(200);

    res.sendFile('index.html');
    res.end();

});


app.listen(process.env.PORT || 8080);