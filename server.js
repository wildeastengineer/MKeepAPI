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
/// Mongoose plugins
var beautifyUnique = require('mongoose-beautiful-unique-validation');
var idValidator = require('mongoose-id-validator');
/// Express plugins
var errorHandler = require('./utils/expressPlugins/errorHandler.js');
var methodNotAllowedErrorHandler = require('./utils/expressPlugins/methodNotAllowedErrorHandler.js');
var notFoundErrorHandler = require('./utils/expressPlugins/notFoundErrorHandler.js');

// register global mongoose plugins
mongoose.plugin(idValidator); // validate ref docs existence
mongoose.plugin(beautifyUnique); // convert mongodb unfriendly duplicate key error to mongoose validation error

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

// error handlers that pass error to final handler
app.use(methodNotAllowedErrorHandler);
app.use(notFoundErrorHandler);

// final error handler
app.use(errorHandler);

// launch ======================================================================
migrator.run(config.get('database:uri') + '/' +config.get('database:name'))
    .then(function () {
        app.listen(port);
        logger.info('The magic happens on port ' + port);
    }).fail(function (error) {
        logger.error('Migrations was failed. ', error);
    });
