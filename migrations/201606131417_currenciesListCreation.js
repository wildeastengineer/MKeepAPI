/// Libs
var Logger = require('../libs/log');
var Q = require('q');

/// Local variables
var logger = Logger(module);

/**
 * Migration that adds currencies to database
 *
 * @param {DataBaseInstance} db
 *
 * @returns {promise}
 */
var currenciesCreation = {
    execute: function (db) {
        var collectionName = 'currencies';
        var currencyCollection;
        var currenciesList = [
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
        var deferred = Q.defer();

        currencyCollection = db.collection(collectionName);

        currencyCollection.ensureIndex({
                iso: 1
            }, {
                unique: true
            })
            .then(function (indexName) {
                return currencyCollection.find({}, {
                    iso: 1,
                    _id: 0
                }).toArray();
            })
            .then(function (docs) {
                var currenciesForAdding = [];
                var currenciesInDb = [];
                var i;

                for (i = 0; i < docs.length; i++) {
                    currenciesInDb.push(docs[i].iso);
                }

                for (i = 0; i < currenciesList.length; i++) {
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
                    .then(function (result) {
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
