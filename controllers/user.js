var _ = require('underscore');
var Q = require('q');

var UserModel = require('../models/auth/user');

var userController = {
    /**
     * Create new user
     *
     * @param {Object} data
     * @param {string} data.username - email in fact
     * @param {string} data.password
     *
     * @returns {promise}
     */
    createUser: function (data) {
        var deferred = Q.defer();

        UserModel.findOne(
            {
                username: data.username
            },
            function (error, user) {
                var newUser;

                if (error) {
                    deferred.reject(error);

                    return;
                }

                if (user) {
                    deferred.reject(new Error('User with this email already exists'));

                    return;
                }

                newUser = new UserModel({
                    username: data.username,
                    password: data.password
                });

                newUser.save(function (error, user) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(_.pick(user, 'username', 'created'));
                    }
                });
            }
        );

        return deferred.promise;
    }
};

module.exports = userController;
