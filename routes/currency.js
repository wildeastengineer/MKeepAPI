var currencyController = require('../controllers/currency.js');

var currencyRegisterRoutes = function (router, isAuthorized, sendError) {
    router.route('/currencies')
        .get(isAuthorized, function (req, res) {
            currencyController.getAll(req.user)
                .then(function (currencies) {
                    res.json(currencies);
                })
                .fail(function (error) {
                    sendError(error, res);
                });
        })
        .post(isAuthorized, function (req, res) {
            currencyController.post(
                req.body.globalCurrencyId
            )
                .then(function (currency) {
                    res.json(currency);
                })
                .fail(function (error) {
                    sendError(error, res);
                });
        });

    router.route('/currencies/global')
        .get(isAuthorized, function (req, res) {
            currencyController.getGlobals()
                .then(function (globalCurrencies) {
                    res.json(globalCurrencies);
                })
                .fail(function (error) {
                    sendError(error, res);
                });
        });

    router.route('/currencies/:currency_id')
        .get(isAuthorized, function (req, res) {
            currencyController.getById(
                req.params.currency_id,
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        })
        .delete(isAuthorized, function (req, res) {
            currencyController.remove(
                req.params.currency_id,
                function (err, currency) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(currency);
                }
            );
        });
};

module.exports = {
    register: currencyRegisterRoutes
};
