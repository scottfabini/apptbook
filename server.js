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
    // Localhost Config
    user: 'sfabini', //env var: PGUSER
    database: 'apptbookdb', //env var: PGDATABASE
    password: '', //env var: PGPASSWORD
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed

    /*
    // CECS Config
    user: 'sfabini', //env var: PGUSER
    host: 'db.cecs.pdx.edu',
    database: 'abc123', //env var: PGDATABASE
    //database: 'public', //env var: PGDATABASE
    password: 'abc123', //env var: PGPASSWORD
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
     */

};



/* Begin boilerplate code for pg postgres connection */
//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect(function(err, client, done) {
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
    console.error('idle client error', err.message, err.stack)
});
/* End boilerplate code for pg postgres connection */


// Serve the index.html calendar webpage
app.get('/', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.status(200);
    res.sendFile('index.html');
    res.end();
});

// Create an appointment
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

// Get all appointments
app.get('/apptbook/read', function(req, res) {
    var queryString = "SELECT event FROM apptbook;";

    pool.query(queryString, function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        res.set('Content-Type', 'text/plain');
        console.log("GET rows: " + JSON.stringify(result.rows));
        res.write(JSON.stringify(result.rows));
        res.status(200);
        res.end();
    });
});

// Reset appointment book to just first two appointments
app.get('/apptbook/reset', function(req, res) {
    var queryString = "DELETE FROM apptbook WHERE hashkey NOT IN ( SELECT hashkey FROM apptbook LIMIT 2 );";

    pool.query(queryString, function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        res.set('Content-Type', 'text/plain');
        console.log("DELETE rows: " + JSON.stringify(result.rows));
        res.write(JSON.stringify(result.rows));

        res.status(200);
        res.end();
    });
});

app.listen(process.env.PORT || 8080 || 80);
