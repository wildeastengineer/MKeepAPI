/// Libs
const DOMParser = require('xmldom').DOMParser;
const Logger = require('../libs/log');
const moment = require('moment');
const Q = require('q');
const request = require('request');
const _ = require('underscore');
/// Models
const ExchangeRateServiceModel = require('../models/exchangeRateService');
/// Controllers
/// Local variables
const exchangeRateServiceHelper = require('../utils/helpers/exchangeRateServiceHelper');
const logger = Logger(module);

let exchangeRateServiceController = {
    /**
     * Get get all Exchange rate services
     *
     * @returns {promise}
     */
    getAll: function () {
        let deferred = Q.defer();

        ExchangeRateServiceModel.find({})
            .exec((error, exchangeRateServices) => {
                if (error) {
                    logger.error('Exchange rate services weren\'t found');
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Exchange rate services were successfully found');
                deferred.resolve(exchangeRateServices);
            });

        return deferred.promise;
    },

    /**
     * Get Exchange rate service by given id
     *
     * @param {ObjectId | string} id
     *
     * @returns {promise}
     */
    getById: function (id) {
        let deferred = Q.defer();

        ExchangeRateServiceModel.findOne({
            _id: id
        })
            .exec((error, exchangeRateService) => {
                if (error) {
                    logger.error('Exchange rate service with given id wasn\'t found: ' + id);
                    logger.error(error);
                    deferred.reject(error);
                } else {
                    logger.info('Exchange rate service with given id was successfully found: ' + id);
                    deferred.resolve(exchangeRateService);
                }
            });

        return deferred.promise;
    },

    /**
     * Get Currency Exchange rate by given id
     *
     * @param {ObjectId | string} id
     *
     * @returns {promise}
     */
    getCurrencyExchangeRate: function (id) {
        let deferred = Q.defer();

        this.getById(id)
            .then((exchangeRateService) => {
                if (!exchangeRateServiceHelper.isUpdateRequired(exchangeRateService)){
                    deferred.resolve(exchangeRateService);

                    return;
                }

                exchangeRateServiceHelper.requestCurrencyRates(exchangeRateService.url)
                    .then((response) => {
                        exchangeRateService.rates = exchangeRateServiceHelper
                            .getRates(exchangeRateService.abbreviation, response);
                        exchangeRateService.lastUpdate = new Date();

                        exchangeRateService.save((error) => {
                            if (error) {
                                logger.error(error);
                                deferred.reject(error);

                                return;
                            }

                            deferred.resolve(exchangeRateService);
                        });
                    })
            })
            .fail((error) => {
                logger.error(error);
                deferred.reject(error);
            });

        return deferred.promise;
    }
};

module.exports = exchangeRateServiceController;
