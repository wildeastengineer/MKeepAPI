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
var currenciesCreation = function (db) {
    var collectionName = 'currencies';
    var currencyCollection;
    var currenciesList = [
        {
            iso: 'AUD'
        },
        {
            iso: 'GBP'
        },
        {
            iso: 'BRL'
        },
        {
            iso: 'HUF'
        },
        {
            iso: 'HKD'
        },
        {
            iso: 'DKK'
        },
        {
            iso: 'EUR'
        },
        {
            iso: 'ILS'
        },
        {
            iso: 'INR'
        },
        {
            iso: 'IDR'
        },
        {
            iso: 'CAD'
        },
        {
            iso: 'CNY'
        },
        {
            iso: 'KRW'
        },
        {
            iso: 'MYR'
        },
        {
            iso: 'MXN'
        },
        {
            iso: 'NZD'
        },
        {
            iso: 'NOK'
        },
        {
            iso: 'PKR'
        },
        {
            iso: 'PLN'
        },
        {
            iso: 'RUB'
        },
        {
            iso: 'SGD'
        },
        {
            iso: 'USD'
        },
        {
            iso: 'TWD'
        },
        {
            iso: 'THB'
        },
        {
            iso: 'TRY'
        },
        {
            iso: 'PHP'
        },
        {
            iso: 'CZK'
        },
        {
            iso: 'CLP'
        },
        {
            iso: 'SEK'
        },
        {
            iso: 'CHF'
        },
        {
            iso: 'ZAR'
        },
        {
            iso: 'JPY'
        }
    ];
    var deferred = Q.defer();

    currencyCollection = db.collection(collectionName);

    currencyCollection.find({}, {iso: 1, _id: 0}).toArray().then(function (docs) {
        var currenciesForAdding = [];
        var i;
        var j;

        if (docs.length === 0) {
            logger.info('Collection "{collection}" is empty - all docs should be added'
                    .replace('{collection}', collectionName));
            currenciesForAdding = currenciesList;
        } else {
            for (i = 0; i < currenciesList.length; i++) {
                for (j = 0; j < docs.length; j++) {
                    if (currenciesList[i].iso === docs[j].iso) {
                        break;
                    }

                    if (j + 1 === docs.length) {
                        currenciesForAdding.push(currenciesList[i]);
                    }
                }
            }
        }

        if (currenciesForAdding.length === 0) {
            logger.info('Collection "{collection}" already has all necessary docs'
                    .replace('{collection}', collectionName));
            deferred.resolve();

            return deferred.promise;
        }

        currencyCollection.insertMany(currenciesForAdding).then(function (result) {
            deferred.resolve();
        }).catch(function (err) {
            deferred.reject(err);
        });

    });

    return deferred.promise;
};

module.exports = currenciesCreation;
