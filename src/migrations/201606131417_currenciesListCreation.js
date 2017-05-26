/// Libs
const Logger = require('../libs/log');
const Q = require('q');

/// Local variables
let logger = Logger(module);

/**
 * Migration that adds currencies to database
 *
 * @param {DataBaseInstance} db
 *
 * @returns {promise}
 */
let currenciesCreation = {
    execute: function (db) {
        let collectionName = 'currencies';
        let currencyCollection;
        let currenciesList = [
            'AUD',
            'GBP',
            'BRL',
            'HUF',
            'HKD',
            'DKK',
            'EUR',
            'ILS',
            'INR',
            'IDR',
            'CAD',
            'CNY',
            'KRW',
            'MYR',
            'MXN',
            'NZD',
            'NOK',
            'PKR',
            'PLN',
            'RUB',
            'SGD',
            'USD',
            'TWD',
            'THB',
            'TRY',
            'PHP',
            'CZK',
            'CLP',
            'SEK',
            'CHF',
            'ZAR',
            'JPY'
        ];
        let deferred = Q.defer();

        currencyCollection = db.collection(collectionName);

        currencyCollection.indexes()
            .then(function (indexes) {
                let indexCreationDeferred;
                let hasIsoIndex = false;

                for (let i = 0; i < indexes.length; i++) {
                    if (indexes[i].name === 'iso_1') {
                        hasIsoIndex = true;
                        break;
                    }
                }

                if (hasIsoIndex) {
                    indexCreationDeferred = Q.defer();
                    indexCreationDeferred.resolve();

                    return indexCreationDeferred;
                }

                return currencyCollection.createIndex({
                    iso: 1
                }, {
                    unique: true
                });
            })
            .then(function () {
                return currencyCollection.find({}, {
                    iso: 1,
                    _id: 0
                }).toArray();
            })
            .then(function (docs) {
                let currenciesForAdding = [];
                let currenciesInDb = [];

                for (let i = 0; i < docs.length; i++) {
                    currenciesInDb.push(docs[i].iso);
                }

                for (let i = 0; i < currenciesList.length; i++) {
                    if (currenciesInDb.indexOf(currenciesList[i]) === -1) {
                        currenciesForAdding.push({
                            iso: currenciesList[i],
                            created: new Date(),
                            modified: new Date()
                        });
                    }
                }

                if (currenciesForAdding.length === 0) {
                    logger.info('Collection "${collection}" already has all necessary docs'
                            .replace('${collection}', collectionName));
                    deferred.resolve();

                    return deferred.promise;
                }

                currencyCollection.insertMany(currenciesForAdding)
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

module.exports = currenciesCreation;
