/// Libs
const bodyParser = require('body-parser');
const config = require('./libs/config');
const express = require('express');
const Logger = require('./libs/log');
const migrator = require('./migrations/migrator');
const mongoose = require('mongoose');
const passport = require('passport');

/// Local variables
let app = express();
let logger = Logger(module);

/// Mongoose plugins
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const idValidator = require('mongoose-id-validator');
const hideDocumentFields = require('./utils/mongoosePlugins/hideDocumentFields.js');

/// Express plugins
const errorHandler = require('./utils/expressPlugins/errorHandler.js');
const methodNotAllowedErrorHandler = require('./utils/expressPlugins/methodNotAllowedErrorHandler.js');
const notFoundErrorHandler = require('./utils/expressPlugins/notFoundErrorHandler.js');

// register global mongoose plugins
mongoose.plugin(idValidator); // validate ref docs existence
mongoose.plugin(beautifyUnique); // convert mongodb unfriendly duplicate key error to mongoose validation error
mongoose.plugin(hideDocumentFields);

// configuration ===============================================================
const env = process.env.NODE_ENV || 'dev';

const appPort = process.env.PORT || config.get(`port:${env}`) || 8080;

const databaseUri = config.get(`database:${env}:uri`);
const databasePort = config.get(`database:${env}:port`);
const databaseName = config.get(`database:${env}:name`);
const databaseUrl = `${databaseUri}:${databasePort}/${databaseName}`;

mongoose.connect(databaseUrl); // connect to our database
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
migrator.run(databaseUrl)
    .then(function () {
        app.listen(appPort);
        logger.info('The magic happens on port ' + appPort);
    }).fail(function (error) {
        logger.error('Migrations was failed. ', error);
    });
