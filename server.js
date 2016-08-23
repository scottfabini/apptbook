/**
 * Copyright (c) 2016 Scott Fabini (scott.fabini@gmail.com)
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */
'use strict';
var express = require('express');
var pg = require('pg');
var app = express();
var path = require('path');
console.log(__dirname + '/index.html');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // probably want to put index/css/calendar in a separate dir like Public/

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
    user: 'sfabini', //env var: PGUSER
    //database: 'apptbookdb', //env var: PGDATABASE
    database: 'public', //env var: PGDATABASE
    password: 'abc123', //env var: PGPASSWORD
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect(function(err, client, done) {
    //var query = 'SELECT $1::int AS number';
    //var arg = ['1'];
    //  var query = "INSERT INTO apptbook (hashkey, description, begin_date_time, end_date_time) VALUES (1471733203000, 'Something completely different', 1472091200000, 1472095200000)";

    var query = "SELECT * FROM apptbook";
    var arg = ['1'];
    if(err) {
        return console.error('error fetching client from pool', err);
    }

    client.query(query, function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if (err) {
            return console.error('error running query', err);
        }
        if (result.rows[0]) {
            console.log(result.rows[0].number);
            //output: 1
        }
    });
});

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
})


// Serve the index.html calendar webpage
app.get('/', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.status(200);
    res.sendFile('index.html');
    res.end();
});

// Begin CRUD interface
app.post('/apptbook/create', function(req, res) {
    console.log("Creating event in db: hashkey: " + parseInt(req.body.hashkey) + "event: " + req.body.event);

    var queryString = 'INSERT INTO apptbook (hashkey, event) VALUES ('
        + parseInt(req.body.hashkey)
        + ", \'"
        + req.body.event
        + "\');";
    pool.query(queryString, function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }
    });

    res.set('Content-Type', 'application/JSON');
    res.write(req.body.event);
    res.status(200);
    res.end();
});

app.get('/apptbook/read', function(req, res) {
    console.log('Cannot get');

    var queryString = "SELECT event FROM apptbook;";

    pool.query(queryString, function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        res.set('Content-Type', 'text/plain');
        console.log("GET rows: " + JSON.stringify(result.rows));
        res.write(JSON.stringify(result.rows));
        //console.log(result.rows[0]);

        res.status(200);
        res.end();
    });
});

app.listen(process.env.PORT || 8080);
