var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var configDB = require('./config/database.js');
var migrations = require('./migrations/migrations');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
app.use(bodyParser()); // get information from html forms

// routes ======================================================================
require('./routes/routes.js')(app, express.Router()); // load our routes and pass in our app and fully configured passport
app.use(function(req, res, next) {
    res.status(404).redirect('/');
});

// launch ======================================================================
migrations.run()
    .then(function () {
        app.listen(port);
        console.log('The magic happens on port ' + port);
    }).fail(function (error) {
        console.error('Migrations was failed. ', error);
    });
