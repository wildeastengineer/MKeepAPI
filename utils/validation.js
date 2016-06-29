/// Libs
var Logger = require('../libs/log');
var Q = require('q');
/// Private variables
var logger = Logger(module);

var Validation = {

    /**
     * Check whether given id is valid and exits in DB
     * @param {ObjectId} entityId
     * @param {Object} model - mongoose model
     *
     * @returns {promise}
     */
    isEntityValid: function (entityId, model) {
        var deferred = Q.defer();
        var error;

        if (!isIdValid(entityId)) {
            error = {
                status: 400,
                message: 'Document id is invalid: ' + entityId
            };

            deferred.reject(error);
        }

        model.findOne({
            _id: entityId
        })
            .exec(function (error, doc) {
                if (!doc) {
                    error = {
                        status: 400,
                        message: 'Document id doesn\'t exist in DB: ' + entityId
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (error) {
                    logger.error('Document with given id wasn\'t found: ' + entityId);
                    logger.error(error);
                    deferred.reject(error);
                } else {
                    logger.info('Document with given id was successfully found: ' + entityId);
                    deferred.resolve(doc);
                }
            });

        return deferred.promise;
    },

    /**
     * Check whether given array of ids is valid and exits in DB
     * @param {ObjectId[]} entityIds
     * @param {Object} model - mongoose model
     *
     * @returns {promise}
     */
    isArrayOfEntitiesValid: function (entityIds, model) {
        var deferred = Q.defer();
        var error;
        var i;

        if (entityIds instanceof Array && entityIds.length === 0) {
            logger.info('Given array of entities is empty and considered as valid');
            deferred.resolve(entityIds);

            return deferred.promise;
        }

        if (!(entityIds instanceof Array)) {
            error = {
                status: 400,
                message: 'Invalid array of ids: ' + entityIds
            };

            deferred.reject(error);
        }

        for (i = 0; i < entityIds.length; i++) {
            if (!isIdValid(entityIds[i])) {
                error = {
                    status: 400,
                    message: 'Document id is invalid: ' + entityIds[i]
                };

                deferred.reject(error);
            }
        }

        model.find({
            _id: {
                $in: entityIds
            }
        })
            .exec(function (error, docs) {
                if (!docs || docs.length === 0 || docs.length !== entityIds.length) {
                    error = {
                        status: 400,
                        message: 'Some of Documents ids or all of them don\'t exist in DB: ' + entityIds
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (error) {
                    logger.error('Documents with given ids wasn\'t found: ' + entityIds);
                    logger.error(error);
                    deferred.reject(error);
                } else {
                    logger.info('Documents with given ids were successfully found: ' + entityIds);
                    deferred.resolve(docs);
                }
            });

        return deferred.promise;
    }
};

/**
 * Check whether given id is valid
 * @param {ObjectId} id
 *
 * @returns {boolean}
 */
function isIdValid(id) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(id.toString());
}

module.exports = Validation;
