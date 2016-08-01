/// Controllers
var currencyController = require('../controllers/currency.js');

var currencyRegisterRoutes = function (router, authenticate) {
    router.get('/currencies', authenticate, function (req, res, next) {
        currencyController.getAll()
            .then(function (currencies) {
                res.json(currencies);
            })
            .fail(function (error) {
                next(error);
            });
    });

    router.get('/currencies/exchange-rate', authenticate, function (req, res,next) {
        currencyController.getAllCurrencyExchangeServices()
            .then(function (rates) {
                res.json(rates);
            })
            .fail(function (error) {
                next(error);
            });
    });

    router.get('/currencies/exchange-rate/:serviceId', authenticate, function (req, res, next) {
        currencyController.getCurrencyExchangeRate(req.params.serviceId)
            .then(function (rate) {
                res.json(rate);
            })
            .fail(function (error) {
                next(error);
            });
    });

    router.get('/currencies/:id', authenticate, function (req, res, next) {
        currencyController.getById(req.params.id)
            .then(function (currency) {
                res.json(currency);
            })
            .fail(function (error) {
                next(error);
            });
    });
};

module.exports = {
    register: currencyRegisterRoutes
};
