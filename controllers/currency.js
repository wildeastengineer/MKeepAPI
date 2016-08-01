/// Libs
var _ = require('underscore');
var Logger = require('../libs/log');
var Q = require('q');
/// Models
var CurrencyModel = require('../models/currency');
var ProjectModel = require('../models/project');
/// Controllers
var ExchangeRateServiceController = require('./exchangerateservice.js');
/// Local variables
var logger = Logger(module);

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
                if (error) {
                    logger.error('Currencies weren\'t found');
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Currencies were successfully found');
                deferred.resolve(currencies);
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

        CurrencyModel.findOne({
            _id: id
        })
            .exec(function (error, currency) {
                if (error) {
                    logger.error('Currency with given id wasn\'t found: ' + id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Currency with given id was successfully found: ' + id);
                deferred.resolve(currency);
        });

        return deferred.promise;
    },

    /**
     * Update currencies array in given project
     * @param {Object} data
     * @param {ObjectId | string} data.id - project id
     * @param {ObjectId | string} data.userId
     * @param {ObjectId[] | string[]} data.currencies
     *
     * @returns {promise}
     */
    updateProjectCurrencies: function (data) {
        var deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            currencies: data.currencies
        }, {
            runValidators: true
        })
            .populate('currencies')
            .exec(function (error, doc) {
                if (error) {
                    logger.error(error);
                    logger.error('Project currencies were not updated: ' + data.id);
                    deferred.reject(error);

                    return;
                }

                logger.info('Project currencies were successfully updated: ' + data.id);
                deferred.resolve(doc.currencies);
            });

        return deferred.promise;
    },

    /**
     * Update main project currency
     * @param {Object} data
     * @param {ObjectId | string} data.id - project id
     * @param {ObjectId | string} data.userId
     * @param {ObjectId | string} data.mainCurrency
     *
     * @returns {promise}
     */
    updateProjectMainCurrency: function (data) {
        var deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            mainCurrency: data.mainCurrency
        }, {
            runValidators: true
        })
            .populate('mainCurrency')
            .exec(function (error, doc) {
                if (error) {
                    logger.error(error);
                    logger.error('Project main currency was not updated: ' + data.id);
                    deferred.reject(error);

                    return;
                }

                logger.info('Project main currency was successfully changed: ' + data.id);
                deferred.resolve(doc.mainCurrency);
            });

        return deferred.promise;
    },

    /**
     * Get exchange currency rate by given service id
     *
     * @param {ObjectId | string} id
     *
     * @returns {promise}
     */
    getCurrencyExchangeRate: function (id) {
        return ExchangeRateServiceController.getCurrencyExchangeRate(id);
    },

    /**
     * Get all exchange currency rate services
     *
     * @returns {promise}
     */
    getAllCurrencyExchangeServices: function () {
        return ExchangeRateServiceController.getAll();
    }
};

module.exports = currencyController;
