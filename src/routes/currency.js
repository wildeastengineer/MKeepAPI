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
    router.get('/currencies', authenticate, (req, res, next) => {
        currencyController.getAll()
            .then((currencies) => {
                res.json(currencies);
            })
            .fail((error) => {
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
    router.get('/currencies/exchange-rate', authenticate, (req, res,next) => {
        currencyController.getAllCurrencyExchangeServices()
            .then((rates) => {
                res.json(rates);
            })
            .fail((error) => {
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
    router.get('/currencies/exchange-rate/:serviceId', authenticate, (req, res, next) => {
        currencyController.getCurrencyExchangeRate(req.params.serviceId)
            .then((rate) => {
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
            .then((currency) => {
                res.json(currency);
            })
            .fail((error) => {
                next(error);
            });
    });
};

module.exports = {
    register: currencyRegisterRoutes
};
