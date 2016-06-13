/// Libs
var async = require('async');
var fs = require('fs');
var Logger = require('../libs/log');
var path = require('path');
var Q = require('q');
/// Local variables
var logger = Logger(module);

var migrator = {

    /**
     * Executes migrations and write information about execution to database
     *
     * @param {string} dbUrl
     *
     * @returns {promise}
     */
    run: function (dbUrl) {
        var deferred = Q.defer();
        var MongoClient = require('mongodb').MongoClient;

        MongoClient.connect(dbUrl, function(err, db) {
            var migrationCollection;

            migrationCollection = db.collection('migrations');

            async.each(getAllMigrations(), function (migration, callback) {
                findAndExecuteMigration(migration).then(function () {
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            }, function (err) {
                if (err) {
                    db.close();
                    deferred.reject(err);

                    return;
                }

                db.close();
                deferred.resolve();
            });

            /**
             * @private
             * @param {Object[]} migration
             *
             * @returns {promise}
             */
            function findAndExecuteMigration (migration) {
                var deferred = Q.defer();
                var executeMigration = require('./' + migration.fileName);

                migrationCollection.find(
                    {
                        name: migration.name
                    }
                ).toArray().then(function (docs) {
                    var i;

                    if (docs.length > 0) {
                        for (i = 0; i < docs.length; i++) {
                            if (migration.date <= docs[i].date) {
                                logger.info('Skip migration "{migration}". It already exists or it is not up-to-date '
                                        .replace('{migration}', migration.fileName));

                                deferred.resolve();

                                return;
                            }
                        }
                    }

                    logger.info('Execute migration "{migration}"'.replace('{migration}', migration.fileName));

                    executeMigration(db).then(function () {
                        migrationCollection.insertOne(migration).then(function (result) {
                            deferred.resolve();
                        }).catch(function (err) {
                            deferred.reject(err);
                        });
                    });
                });

                return deferred.promise;
            }
        });

        return deferred.promise;

        /**
         * Returns all available migrations and dates of their creation
         *
         * @returns {Object[]}
         */
        function getAllMigrations () {
            var arrayOfMigrations;
            var migrations = [];
            var i;

            arrayOfMigrations = getArrayOfMigrations();

            for (i = 0; i < arrayOfMigrations.length; i++) {
                migrations.push({
                    name: getMigrationName(arrayOfMigrations[i]),
                    date: getMigrationDate(arrayOfMigrations[i]),
                    fileName: arrayOfMigrations[i]
                });
            }

            return migrations;

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

            /**
             * @private
             *
             * @returns {string[]}
             */
            function getArrayOfMigrations () {
                var migrationsDirFiles = fs.readdirSync(__dirname);
                var migratorFileName = path.basename(__filename);
                var migratorFileIndex = migrationsDirFiles.indexOf(migratorFileName);

                migrationsDirFiles.splice(migratorFileIndex, 1);

                return migrationsDirFiles;
            }
        }
    }
};

module.exports = migrator;
