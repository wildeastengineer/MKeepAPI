/// Libs
const _ = require('underscore');
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const CurrencyModel = require('../models/currency');
const ProjectModel = require('../models/project');
/// Controllers
const ExchangeRateServiceController = require('./exchangerateservice.js');
/// Local variables
let logger = Logger(module);

/**
 * Currencies controller.
 * @class controllers/Currency
 */
let currencyController = {
    /**
     * Get get all currencies
     *
     * @function
     * @name getAll
     * @memberof controllers/Currency
     *
     * @returns {Promise<models/CurrencySchema[]|Error>}
     */
    getAll: function () {
        let deferred = Q.defer();

        CurrencyModel.find({})
            .exec((error, currencies) => {
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
     *
     * @function
     * @name getById
     * @memberof controllers/Currency
     *
     * @param {(ObjectId|String)} id
     *
     * @returns {Promise<models/CurrencySchema|Error>}
     */
    getById: function (id) {
        let deferred = Q.defer();

        CurrencyModel.findOne({
            _id: id
        })
            .exec((error, currency) => {
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
     *
     * @function
     * @name updateProjectCurrencies
     * @memberof controllers/Currency
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - Project's id
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId[]|String[])} data.currencies
     *
     * @returns {Promise<models/CurrencySchema[]|Error>}
     */
    updateProjectCurrencies: function (data) {
        let deferred = Q.defer();

        if (!data.currencies) {
            const error = {
                name: 'ValidationError',
                message: 'Project currencies were not specified'
            };

            logger.error(error);
            deferred.reject(error);

            return deferred.promise;
        }

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            currencies: data.currencies
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .populate('currencies')
            .exec((error, doc) => {
                if (error) {
                    logger.error('Project currencies were not updated: ' + data.id);
                    logger.error(error);
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
     *
     * @function
     * @name updateProjectMainCurrency
     * @memberof controllers/Currency
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - Project's id
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.mainCurrency
     *
     * @returns {Promise<models/CurrencySchema|Error>}
     */
    updateProjectMainCurrency: function (data) {
        let deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            mainCurrency: data.mainCurrency
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .populate('mainCurrency')
            .exec((error, doc) => {
                if (error) {
                    logger.error('Project main currency was not updated: ' + data.id);
                    logger.error(error);
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
     * @function
     * @name getCurrencyExchangeRate
     * @memberof controllers/Currency
     *
     * @param {(ObjectId|String)} id
     *
     * @returns {Promise<Object|Error>}
     */
    getCurrencyExchangeRate: function (id) {
        return ExchangeRateServiceController.getCurrencyExchangeRate(id);
    },

    /**
     * Get all exchange currency rate services
     *
     * @function
     * @name getAllCurrencyExchangeServices
     * @memberof controllers/Currency
     *
     * @returns {Promise<Object[]|Error>}
     */
    getAllCurrencyExchangeServices: function () {
        return ExchangeRateServiceController.getAll();
    }
};

module.exports = currencyController;
