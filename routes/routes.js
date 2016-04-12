var passport = require('passport');
var oauth2 = require('../libs/oauth2');

var accountRoutes = require('./account');
var categoryRoutes = require('./category');
var currencyRoutes = require('./currency');
var dashboardRoutes = require('./dashboard');
var transactionRoutes = require('./transaction');

var authenticate;

module.exports = function (app, router) {
    authenticate = passport.authenticate('bearer', {
        session: false
    });

    // Register authentication routes
    router.post('/authenticate', oauth2.token);
    router.get('/profile', authenticate, function (req, res) {
        res.json({
            user_id: req.user.userId,
            name: req.user.username,
            scope: req.authInfo.scope
        })
    });

    // Register API routes
    router.get('/', function (req, res) {
        res.json({
            message: 'Welcome to MoneyKeeper API'
        });
    });

    accountRoutes.register(router, authenticate, sendError);
    categoryRoutes.register(router, authenticate, sendError);
    currencyRoutes.register(router, authenticate, sendError);
    dashboardRoutes.register(router, authenticate, sendError);
    transactionRoutes.register(router, authenticate, sendError);

    // All of our routes will be prefixed with '/api'
    app.use('/api', router);
};

function sendError(error, response) {
    if (error) {
        response.status(error.status || 500);
        response.send({
            message: error.message
        });
    }
}
