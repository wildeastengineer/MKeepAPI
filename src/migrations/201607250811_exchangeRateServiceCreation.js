/// Libs
const Logger = require('../libs/log');
const Q = require('q');

/// Local variables
let logger = Logger(module);

/**
 * Migration that adds exchange currency rate services to database
 *
 * @param {DataBaseInstance} db
 *
 * @returns {promise}
 */
let exchangeRateServiceCreation = {
    execute: function (db) {
        let collectionName = 'exchangerateservices';
        let deferred = Q.defer();
        let exchangeRateServiceCollection;
        let exchangeRateServiceList = [
            {
                name: 'Центральный банк Российской Федерации',
                abbreviation: 'CBR',
                url: 'http://www.cbr.ru/scripts/XML_daily_eng.asp',
                lastUpdate: null,
                updateTime: '14:00:00 GMT+0300',
                base: 'RUB',
                rates: {},
                created: new Date()
            },
            {
                name: 'European Central Bank',
                abbreviation: 'ECB',
                url: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
                lastUpdate: null,
                updateTime: '16:00:00 GMT+0100',
                base: 'EUR',
                rates: {},
                created: new Date()
            },
            {
                name: 'Open Exchange Rates API (forex)',
                abbreviation: 'OER',
                url: 'https://openexchangerates.org/api/latest.json?app_id=f30c1cbbe48445d3af6a995d7fd9f30b',
                lastUpdate: null,
                updatePeriod: 3600, //seconds
                base: 'USD',
                rates: {},
                created: new Date()
            }
        ];

        exchangeRateServiceCollection = db.collection(collectionName);
        
        exchangeRateServiceCollection.createIndex({
                    name: 1,
                    abbreviation: 1,
                    url: 1
                }, {
                    unique: true
                })
            .catch(function (error) {
                deferred.reject(error);

                return deferred.promise;
            })
            .then(function () {
                return exchangeRateServiceCollection.find({}, {
                    abbreviation: 1,
                    _id: 0
                }).toArray();
            })
            .then(function (docs) {
                let servicesForAdding = [];
                let servicesInDb = [];

                for (let i = 0; i < docs.length; i++) {
                    servicesInDb.push(docs[i].abbreviation);
                }

                for (let i = 0; i < exchangeRateServiceList.length; i++) {
                    if (servicesInDb.indexOf(exchangeRateServiceList[i].abbreviation) === -1) {
                        servicesForAdding.push(exchangeRateServiceList[i]);
                    }
                }

                if (servicesForAdding.length === 0) {
                    logger.info('Collection "${collection}" already has all necessary docs'
                            .replace('${collection}', collectionName));
                    deferred.resolve();

                    return deferred.promise;
                }

                exchangeRateServiceCollection.insertMany(servicesForAdding)
                    .then(function () {
                        deferred.resolve();
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    });
            });

        return deferred.promise;
    }
};

module.exports = exchangeRateServiceCreation;
