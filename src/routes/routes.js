/// Libs
const passport = require('passport');
/// Routes
const config = require('../libs/config');
const accountRoutes = require('./account');
const currencyRoutes = require('./currency');
const dashboardRoutes = require('./dashboard');
const projectRoutes = require('./project');
const transactionRoutes = require('./transaction');
const userRoutes = require('./user');
/// Local variables
let authenticate;

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
    currencyRoutes.register(router, authenticate);
    dashboardRoutes.register(router, authenticate);
    transactionRoutes.register(router, authenticate);
    projectRoutes.register(router, authenticate);

    // All of our routes will be prefixed with '/api'
    app.use(config.get('baseUrl'), router);
};
