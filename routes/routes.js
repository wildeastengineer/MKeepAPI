/// Libs
var passport = require('passport');
/// Routes
var config = require('../libs/config');
var accountRoutes = require('./account');
var categoryRoutes = require('./category');
var currencyRoutes = require('./currency');
var dashboardRoutes = require('./dashboard');
var projectRoutes = require('./project');
var transactionRoutes = require('./transaction');
var userRoutes = require('./user');
/// Local variables
var authenticate;

module.exports = function (app, router) {
    authenticate = passport.authenticate('bearer', {
        session: false
    });

    // Register API routes
    router.get('/', function (req, res) {
        res.json({
            message: 'Welcome to MoneyKeeper API'
        });
    });

    userRoutes.register(router, authenticate);

    accountRoutes.register(router, authenticate);
    categoryRoutes.register(router, authenticate);
    currencyRoutes.register(router, authenticate);
    dashboardRoutes.register(router, authenticate);
    transactionRoutes.register(router, authenticate);
    projectRoutes.register(router, authenticate);

    // All of our routes will be prefixed with '/api'
    app.use(config.get('baseUrl'), router);
};
