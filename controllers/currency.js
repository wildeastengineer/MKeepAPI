/// Libs
var _ = require('underscore');
var Logger = require('../libs/log');
var Q = require('q');
/// Models
var CurrencyModel = require('../models/currency');
/// Local variables
var logger = Logger(module);

// ToDo: remove this when auth is implemented
var user = {
    _id: 777
};

var currencyController = {
    /**
     * Get get all currencies
     *
     * @returns {promise}
     */
    getAll: function () {
        var deferred = Q.defer();

        CurrencyModel.find({})
            .exec(function (error, currencies) {
                if (!currencies) {
                    error = {
                        status: 404,
                        message: 'Currencies weren\'t found:'
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (error) {
                    logger.error('Currencies weren\'t found');
                    logger.error(error);
                    deferred.reject(error);
                } else {
                    logger.info('Currencies were successfully found');
                    deferred.resolve(currencies);
                }
            });

        return deferred.promise;
    },

    /**
     * Get currency by given id
     * @param {ObjectId | string} id
     *
     * @returns {promise}
     */
    getById: function (id) {
        var deferred = Q.defer();

        Currency.findOne({
            _id: id
        })
            .exec(function (error, currency) {
                if (!currency) {
                    error = {
                        status: 404,
                        message: 'Currency with given id wasn\'t found: ' + id
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (error) {
                    logger.error('Currency with given id wasn\'t found: ' + id);
                    logger.error(error);
                    deferred.reject(error);
                } else {
                    logger.info('Currency with given id was successfully found: ' + id);
                    deferred.resolve(currency);
                }
        });

        return deferred.promise;
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

                currency = new CurrencyModel();
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
        CurrencyModel.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                CurrencyModel.find(
                    {
                        _owner: user._id
                    })
                    .exec(callback);
            }
        );
    },
    getGlobals: function () {
        var deferred = Q.defer();

        CurrencyModel.find(
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

        CurrencyModel.findOne({
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
        var currency = new CurrencyModel();
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
