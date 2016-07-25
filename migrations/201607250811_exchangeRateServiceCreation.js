/// Libs
var Logger = require('../libs/log');
var Q = require('q');

/// Local variables
var logger = Logger(module);

/**
 * Migration that adds exchange currency rate services to database
 *
 * @param {DataBaseInstance} db
 *
 * @returns {promise}
 */
var exchangeRateServiceCreation = {
    execute: function (db) {
        var collectionName = 'exchangerateservices';
        var currencyCollection;
        var currenciesList;

        var deferred = Q.defer();

        currencyCollection = db.collection(collectionName);

        currencyCollection.indexes()
            .then(function (indexes) {
                var indexCreationDeferred;
                var hasIsoIndex = false;
                var i;

                for (i = 0; i < indexes.length; i++) {
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
