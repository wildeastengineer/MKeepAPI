var Q = require('q');

var currencies = [
    {
        name: 'rubles',
        icon: 'fa-rub'
    },
    {
        name: 'dollars',
        icon: 'fa-usd'
    },
    {
        name: 'euro',
        icon: 'fa-eur'
    },
    {
        name: 'pound',
        icon: 'fa-gbp'
    }
];
var currenciesController = require('../controllers/currency');

module.exports = function () {
    var deferred = Q.defer();

    currenciesController.getGlobals()
        .then(function (globalCurrencies) {
            if (globalCurrencies && globalCurrencies.length === currencies.length) {
                console.log('Migration 001 is skipped.');
                deferred.resolve();
                return;
            }

            if (!globalCurrencies || globalCurrencies.length === 0) {
                addAllCurrencies(currenciesController, currencies, deferred);
                return;
            }

            deferred.reject('Migration 001: Currencies merging is not implemented');
        })
        .fail(function (error) {
            deferred.reject(error);
        });

    return deferred.promise;

    function addAllCurrencies(currenciesController, currencies, deferred) {
        var i;
        var promises = [];

        for (i = 0; i < currencies.length; i++) {
            promises.push(currenciesController.addGlobal(currencies[i]));
        }

        Q.all(promises)
            .then(function () {
                deferred.resolve();
            })
            .fail(function (error) {
                deferred.reject(error);
            });
    }
};
