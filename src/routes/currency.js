/// Controllers
const currencyController = require('../controllers/currency.js');

/**
 * Currencies routes.
 * @class routes/Currency
 */
let currencyRegisterRoutes = function (router, authenticate) {
    /**
     * Get the list of all global currencies
     *
     * @function
     * @name GET: /currencies
     * @memberof routes/Currency
     *
     * @returns {models/CurrencySchema[]} currencies
     */
    router.get('/currencies', authenticate, function (req, res, next) {
        currencyController.getAll()
            .then(function (currencies) {
                res.json(currencies);
            })
            .fail(function (error) {
                next(error);
            });
    });

    /**
     * Get currency exchange rates services
     *
     * @function
     * @name GET: /currencies/exchange-rate
     * @memberof routes/Currency
     *
     * @returns {Object[]} rates
     */
    router.get('/currencies/exchange-rate', authenticate, function (req, res,next) {
        currencyController.getAllCurrencyExchangeServices()
            .then(function (rates) {
                res.json(rates);
            })
            .fail(function (error) {
                next(error);
            });
    });

    /**
     * Get currency exchange rates
     *
     * @function
     * @name GET: /currencies/exchange-rate/:serviceId
     * @memberof routes/Currency
     *
     * @returns {Object} rates
     */
    router.get('/currencies/exchange-rate/:serviceId', authenticate, function (req, res, next) {
        currencyController.getCurrencyExchangeRate(req.params.serviceId)
            .then(function (rate) {
                res.json(rate);
            })
            .fail(function (error) {
                next(error);
            });
    });

    /**
     * Get currency by id
     *
     * @function
     * @name GET: /currencies/:id
     * @memberof routes/Currency
     *
     * @returns {models/CurrencySchema} currency
     */
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
