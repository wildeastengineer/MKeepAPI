/// Libs
var bodyParser = require('body-parser');
var config = require('./libs/config');
var express = require('express');
var Logger = require('./libs/log');
var migrator = require('./migrations/migrator');
var mongoose = require('mongoose');
var passport = require('passport');
/// Local variables
var app = express();
var logger = Logger(module);
var port = config.get('port');

// configuration ===============================================================
mongoose.connect(config.get('database:uri')); // connect to our database
app.use(bodyParser()); // get information from html forms
app.use(passport.initialize());

// routes ======================================================================
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-origin, content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});
require('./routes/routes.js')(app, express.Router()); // load our routes and pass in our app and fully configured passport
app.use(function(req, res, next) {
    res.status(404).redirect('/');
});

// launch ======================================================================
migrator.run(config.get('database:uri') + '/' +config.get('database:name'))
    .then(function () {
        app.listen(port);
        logger.info('The magic happens on port ' + port);
    }).fail(function (error) {
        logger.error('Migrations was failed. ', error);
    });
