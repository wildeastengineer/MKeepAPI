var _ = require('underscore');
var Q = require('q');

// ToDo: remove this when auth is implemented
var user = {
    _id: 777
};

var Currency = require('../models/currency');
var currencyController = {
    getAll: function () {
        var deferred = Q.defer();

        Currency.find(
            {
                _owner: user._id
            })
            .exec(function (error, currencies) {
                if (error) {
                    deferred.reject(error);
                    return;
                }

                deferred.resolve(currencies);
            });

        return deferred.promise;
    },
    getById: function (id, callback) {
        Currency.findOne({
            _id: id,
            _owner: user._id
        })
            .exec(callback);
    },
    post: function (globalCurrencyId) {
        var currency;
        var deferred = Q.defer();

        this.getGlobalById(globalCurrencyId)
            .then(function (globalCurrency) {
                if (!globalCurrency) {
                    deferred.reject({
                        message: 'Global currency with id="' + globalCurrencyId + '" does not exist.'
                    });

                    return;
                }

                currency = new Currency();
                _.extend(currency, {
                    _owner: user._id,
                    name: globalCurrency.name,
                    icon: globalCurrency.icon,
                    globalId: globalCurrencyId
                });

                //ToDo: add already existing validation by globalId
                currency.save(function (error, newCurrency) {
                    if (error) {
                        deferred.reject(error);
                        return;
                    }

                    deferred.resolve(newCurrency);
                });
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    },
    remove: function (id, callback) {
        Currency.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                Currency.find(
                    {
                        _owner: user._id
                    })
                    .exec(callback);
            }
        );
    },
    getGlobals: function () {
        var deferred = Q.defer();

        Currency.find(
            {
                _owner: 0
            })
            .exec(function (error, globalCurrencies) {
                if (error) {
                    deferred.reject(error);
                    return;
                }

                deferred.resolve(globalCurrencies);
            });

        return deferred.promise;
    },
    getGlobalById: function (id) {
        var deferred = Q.defer();

        console.log('getGlobalById', id);

        Currency.findOne({
            _id: id,
            _owner: 0
        })
            .exec(function (error, currency) {
                if (error) {
                    deferred.reject(error);
                    return;
                }

                deferred.resolve(currency);
            });

        return deferred.promise;
    },
    addGlobal: function (currencyData) {
        var currency = new Currency();
        var deferred = Q.defer();

        _.extend(currency, currencyData, {
            _owner: 0,
            global: 0
        });

        currency.save(function (error, newCurrency) {
            if (error) {
                deferred.reject(error);
                return;
            }

            deferred.resolve(newCurrency);
        });

        return deferred.promise;
    }
};

module.exports = currencyController;
