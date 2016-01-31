var dashboardController = require('./controllers/dashboard');
var categoryController = require('./controllers/category');
var currencyController = require('./controllers/currency');
var accountController = require('./controllers/account');
var transactionController = require('./controllers/transaction');


module.exports = function (app, router) {
    // =================================================================================================================
    // === Register API routes =========================================================================================
    // =================================================================================================================
    router.get('/', function (req, res) {
        res.json({
            message: 'Welcome to MoneyKeeper API'
        });
    });

    dashboardController.registerRoutes(router, isAuthorized, sendError);
    accountController.registerRoutes(router, isAuthorized, sendError);
    categoryController.registerRoutes(router, isAuthorized, sendError);
    currencyController.registerRoutes(router, isAuthorized, sendError);
    transactionController.registerRoutes(router, isAuthorized, sendError);

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
