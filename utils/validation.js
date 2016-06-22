/// Libs
var mongoose = require('mongoose');
var Q = require('q');

var Validation = {
    /**
     * Check whether given id is valid and exits in DB
     * @param {string} entityId
     * @param {Object} controller
     *
     * @returns {promise}
     */
    isValidAndExist: function (entityId, controller) {
        var deferred = Q.defer();
        var error;

        if (!entityId.toString().match(/^[0-9a-fA-F]{24}$/)) {
            error = {
                status: 403,
                message: 'Document id is invalid: ' + entityId
            };

            deferred.reject(error);
        }

        controller.getById(entityId)
            .then(function (doc) {
                deferred.resolve(doc);
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }
};

module.exports = Validation;
