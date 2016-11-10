/// Libs
const async = require('async');
const fs = require('fs');
const Logger = require('../libs/log');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const Q = require('q');

/// Local variables
let logger = Logger(module);

let migrator = {

    /**
     * Executes migrations and write information about execution to database
     *
     * @param {string} dbUrl
     *
     * @returns {promise}
     */
    run: function (dbUrl) {
        let deferred = Q.defer();

        MongoClient.connect(dbUrl, function(err, db) {
            let migrationCollection;

            migrationCollection = db.collection('migrations');
            
            migrationCollection.ensureIndex({
                    date: 1,
                    fileName: 1
                }, {
                    unique: true
                })
                .then(function (indexName) {
                    async.eachSeries(getArrayOfMigrations(), function (migration, callback) {
                        findAndExecuteMigration(migration)
                            .then(function () {
                                callback();
                            })
                            .fail(function (err) {
                                callback(err);
                            });
                    }, function (err) {
                        db.close();

                        if (err) {
                            deferred.reject(err);

                            return;
                        }

                        deferred.resolve();
                    });
                });

            /**
             * @private
             * @param {string} migrationFile
             *
             * @returns {promise}
             */
            function findAndExecuteMigration (migrationFile) {
                let deferred = Q.defer();
                let migration = require('./' + migrationFile);
                let migrationObj = {
                    name: getMigrationName(migrationFile),
                    date: getMigrationDate(migrationFile),
                    fileName: migrationFile
                };

                migrationCollection.find({}).toArray()
                    .then(function (docs) {
                        let checkMig = checkMigration(migrationObj, docs);

                        if (checkMig.isExecuted) {
                            logger.info('Skip migration. "${migration}" is already executed'
                                    .replace('${migration}', migrationFile));
                            deferred.resolve();

                            return;
                        }

                        if (!checkMig.isActual) {
                            deferred.reject('Stop migrating. "${migration}" is not up-to-date '
                                    .replace('${migration}', migrationFile));

                            return;
                        }

                        logger.info('Execute migration "${migration}"'.replace('${migration}', migrationObj.fileName));

                        migration.execute(db)
                            .then(function () {
                                migrationCollection.insertOne({
                                    name: migrationObj.name,
                                    date: migrationObj.date,
                                    fileName: migrationObj.fileName,
                                    created: new Date()
                                }).then(function (result) {
                                    deferred.resolve();
                                }).catch(function (err) {
                                    deferred.reject(err);
                                });
                            })
                            .fail(function (err) {
                                deferred.reject(err);
                            });
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    });

                return deferred.promise;

                /**
                 * @private
                 * @param {Object} migration
                 * @param {string} migration.date
                 * @param {string} migration.fileName
                 * @param {Object[]} executedMigrations
                 * @param {Object} executedMigrations.migration
                 * @param {string} executedMigrations.migration.date
                 *
                 * @returns {Object} result
                 * @returns {boolean} result.isActual
                 * @returns {boolean} result.isExecuted
                 */
                function checkMigration (migration, executedMigrations) {
                    let result = {
                        isActual: true,
                        isExecuted: false
                    };

                    if (executedMigrations.length > 0) {
                        for (let i = 0; i < executedMigrations.length; i++) {
                            if (migration.date === executedMigrations[i].date) {
                                result = {
                                    isActual: false,
                                    isExecuted: true
                                };

                                return result;
                            }

                            if (migration.date < executedMigrations[i].date) {
                                result.isActual = false;

                                return result;
                            }
                        }
                    }

                    return result;
                }

                /**
                 * @private
                 * @param {string} fileName
                 *
                 * @returns {string}
                 */
                function getMigrationName (fileName) {
                    return fileName.slice(fileName.indexOf('_') + 1).replace('.js', '');
                }

                /**
                 * @private
                 * @param {string} fileName
                 *
                 * @returns {string}
                 */
                function getMigrationDate (fileName) {
                    return fileName.slice(0, fileName.indexOf('_'));
                }
            }
        });

        return deferred.promise;

        /**
         * @private
         *
         * @returns {string[]}
         */
        function getArrayOfMigrations () {
            let migrationsDirFiles = fs.readdirSync(__dirname);
            let migratorFileName = path.basename(__filename);
            let migratorFileIndex = migrationsDirFiles.indexOf(migratorFileName);

            migrationsDirFiles.splice(migratorFileIndex, 1);

            return migrationsDirFiles.sort();
        }
    }
};

module.exports = migrator;
