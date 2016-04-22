/// Libs
var passport = require('passport');
/// Routes
var config = require('../libs/config');
var accountRoutes = require('./account');
var categoryRoutes = require('./category');
var currencyRoutes = require('./currency');
var dashboardRoutes = require('./dashboard');
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

    userRoutes.register(router, authenticate, sendError);

    accountRoutes.register(router, authenticate, sendError);
    categoryRoutes.register(router, authenticate, sendError);
    currencyRoutes.register(router, authenticate, sendError);
    dashboardRoutes.register(router, authenticate, sendError);
    transactionRoutes.register(router, authenticate, sendError);

    // All of our routes will be prefixed with '/api'
    app.use(config.get('baseUrl'), router);
};

function sendError(error, response) {
    if (error) {
        response.status(error.status || 500);
        response.send({
            message: error.message
        });
    }
}
