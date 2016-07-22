/// Controllers
var currencyController = require('../controllers/currency.js');

var currencyRegisterRoutes = function (router, authenticate, next) {
    router.get('/currencies', authenticate, function (req, res) {
        currencyController.getAll()
            .then(function (currencies) {
                res.json(currencies);
            })
            .fail(function (error) {
                next(error);
            });
    });

    router.get('/currencies/:id', authenticate, function (req, res) {
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
