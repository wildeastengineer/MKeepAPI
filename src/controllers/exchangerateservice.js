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
let logger = Logger(module);

let exchangeRateServiceController = {
    /**
     * Get get all Exchange rate services
     *
     * @returns {promise}
     */
    getAll: function () {
        let deferred = Q.defer();

        ExchangeRateServiceModel.find({})
            .exec(function (error, exchangeRateServices) {
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
            .exec(function (error, exchangeRateService) {
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
            .then(function (exchangeRateService) {
                if (!isUpdateRequired(exchangeRateService)){
                    deferred.resolve(exchangeRateService);

                    return;
                }

                requestCurrencyRates(exchangeRateService.url)
                    .then(function (response) {
                        exchangeRateService.rates = getRates(exchangeRateService.abbreviation, response);
                        exchangeRateService.lastUpdate = new Date();

                        exchangeRateService.save(function (error) {
                            if (error) {
                                logger.error(error);
                                deferred.reject(error);

                                return;
                            }

                            deferred.resolve(exchangeRateService);
                        });
                    })
            })
            .fail(function(error) {
                logger.error(error);
                deferred.reject(error);
            });

        return deferred.promise;
    }
    /* start-test-code */
    , __testOnly__: {
        requestCurrencyRates,
        getRates,
        getCBRRatesObject,
        getECBRatesObject,
        getOERRatesObject,
        isUpdateRequired
    }
    /* end-test-code */
};

/// Private functions
/**
 * Make request to given service url
 *
 * @param {string} url
 *
 * @returns {promise}
 */
function requestCurrencyRates (url) {
    let deferred = Q.defer();

    request.get(url, function (error, response, body) {
        if (error) {
            logger.error('Failed to request exchange rate from "${service}"'
                .replace('${service}', url));

            deferred.reject(error);

            return;
        }

        if (response.statusCode !== 200 && response.statusCode !== 201 && response.statusMessage !== 'OK') {
            error = new Error('Failed to request exchange rate from "${service}" - Response status: "${status}"'
                .replace('${service}', url)
                .replace('${status}', response.statusCode));

            deferred.reject(error);

            return;
        }

        deferred.resolve(response.body);
    });

    return deferred.promise;
}

/**
 * Get currency exchange rate object
 *
 * @param {string} serviceName
 * @param {string | JSON} response
 *
 * @returns {?Object} rate
 * @returns {?string} rate.currencyAbbreviation
 */
function getRates (serviceName, response) {
    switch (serviceName) {
        case 'CBR':
            return getCBRRatesObject(response);
        case 'ECB':
            return getECBRatesObject(response);
        case 'OER':
            return getOERRatesObject(response);
        default:
            return null;
    }
}

/**
 * Format currency exchange rate object from given xml string
 *
 * @param {string} response (string XML)
 *
 * @returns {Object} rate
 * @returns {string} rate.currencyAbbreviation
 */
function getCBRRatesObject (response) {
    let charCode;
    let doc = new DOMParser().parseFromString(response);
    let rate = {};
    let rateValue;
    let valuates;

    valuates = doc.documentElement.getElementsByTagName('Valute');

    for (let i = 0; i < valuates.length; i++) {
        charCode = valuates[i].getElementsByTagName('CharCode');
        rateValue = valuates[i].getElementsByTagName('Value');

        if (!(charCode.length === 1 && rateValue.length === 1)) {
            continue;
        }

        charCode = charCode[0];
        rateValue = rateValue[0];

        if (charCode.hasChildNodes() && rateValue.hasChildNodes()
            && charCode.firstChild.nodeValue === charCode.lastChild.nodeValue
            && rateValue.firstChild.nodeValue === rateValue.lastChild.nodeValue){
            rate[charCode.firstChild.nodeValue] = rateValue.firstChild.nodeValue;
        }
    }

    return rate;
}

/**
 * Format currency exchange rate object from given xml string
 *
 * @param {string} response (string XML)
 *
 * @returns {Object} rate
 * @returns {string} rate.currencyAbbreviation
 */
function getECBRatesObject (response) {
    let currency;
    let doc = new DOMParser().parseFromString(response);
    let rate = {};
    let rateValue;
    let valuates;

    valuates = doc.documentElement.getElementsByTagName('Cube');

    for (let i = 0; i < valuates.length; i++) {
        currency = valuates[i].getAttribute('currency');
        rateValue = valuates[i].getAttribute('rate');

        if (!(currency && rateValue)) {
            continue;
        }

        rate[currency] = rateValue;
    }

    return rate;
}

/**
 * Format currency exchange rate object from given JSON
 *
 * @param {JSON} response
 *
 * @returns {Object} rate
 * @returns {number} rate.currencyAbbreviation
 */
function getOERRatesObject (response) {
    return JSON.parse(response).rates;
}

/**
 * Check whether currency exchange rate update is needed
 *
 * @param {Object} exchangeRateService
 * @param {Date} [exchangeRateService.lastUpdate]
 * @param {Object} [exchangeRateService.rates]
 * @param {number | string} [exchangeRateService.currencyAbbreviation]
 * @param {Date} [exchangeRateService.updateTime]
 * @param {Date} [exchangeRateService.updatePeriod]
 *
 * @returns {boolean}
 */
function isUpdateRequired (exchangeRateService) {
    let currentTime = moment();
    let lastUpdateTime;
    let nextUpdateTime;

    if (!exchangeRateService.lastUpdate || !exchangeRateService.rates ||
        _.isEmpty(exchangeRateService.rates)) {
        return true;
    }

    lastUpdateTime = moment(exchangeRateService.lastUpdate);

    if (exchangeRateService.updateTime) {
        nextUpdateTime = moment(exchangeRateService.updateTime, 'HH-mm-ss');

        if (currentTime.isAfter(nextUpdateTime)) {
            nextUpdateTime = nextUpdateTime.add(1, 'd'); // each rate services with update time is updated once a day
        }

        if (lastUpdateTime.isBefore(moment(nextUpdateTime).subtract(1, 'd'))) {
            return true;
        }
    }

    if (exchangeRateService.updatePeriod) {
        nextUpdateTime = moment(lastUpdateTime).add(exchangeRateService.updatePeriod, 's');
    }

    return currentTime.isAfter(lastUpdateTime) && !currentTime.isBetween(lastUpdateTime, nextUpdateTime);
}

module.exports = exchangeRateServiceController;
