var accountRoutes = require('./account');
var categoryRoutes = require('./category');
var currencyRoutes = require('./currency');
var dashboardRoutes = require('./dashboard');
var transactionRoutes = require('./transaction');

module.exports = function (app, router) {
    // =================================================================================================================
    // === Register API routes =========================================================================================
    // =================================================================================================================
    router.get('/', function (req, res) {
        res.json({
            message: 'Welcome to MoneyKeeper API'
        });
    });

    accountRoutes.register(router, isAuthorized, sendError);
    categoryRoutes.register(router, isAuthorized, sendError);
    currencyRoutes.register(router, isAuthorized, sendError);
    dashboardRoutes.register(router, isAuthorized, sendError);
    transactionRoutes.register(router, isAuthorized, sendError);

    // all of our routes will be prefixed with /api
    app.use('/api', router);
};

function isAuthorized(req, res, next) {
    return next();
}

function sendError(error, response) {
    if (error) {
        response.status(error.status || 500);
        response.send({
            message: error.message
        });
    }
}
