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

                newUser.created = new Date();

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
    },
    /**
     * Generate password recovery token
     *
     * @param {string} username - email in fact
     *
     * @returns {promise}
     */
    generatePassRecoveryToken: function (username) {
        var deferred = Q.defer();

        UserModel.findOne(
            {
                username: username
            },
            function (error, user) {
                if (error) {
                    deferred.reject(error);

                    return;
                }

                if (!user) {
                    deferred.reject(new Error('User with this email doesn\'t exist'));

                    return;
                }

                user.passRecoveryToken = generateRecoveryToken(user);
                user.passRecoveryCreatedAt = new Date();

                user.save(function (error) {
                    if (error) {
                        deferred.reject(error);

                        return;
                    }

                    deferred.resolve(user);
                });
            }
        );

        return deferred.promise;

        /**
         * Generate password recovery token
         *
         * @param {Object} user
         * @param {string} user.username
         * @param {Function} user.encryptPassword
         *
         * @returns {string}
         */
        function generateRecoveryToken (user) {
            var encryptedRecoveryToken;
            var plainRecoveryToken = user.username + Date.parse(new Date);

            encryptedRecoveryToken = user.encryptPassword(plainRecoveryToken);

            return encryptedRecoveryToken;
        }
    },
    /**
     * Check whether password recovery token exists and is not expired
     *
     * @param {Object} data
     * @param {string} data.username - email in fact
     * @param {string} data.token - password recovery token that is passed as param in url
     *
     * @returns {promise}
     */
    isPassRecoveryTokenExpired: function (data) {
        var expirationPeriod = 12; //how many hours should be passed till date is expired
        var deferred = Q.defer();
        var result = {
            success: true,
            message: 'Password can be changed. Password recovery token is valid and actual'
        };

        UserModel.findOne(
            {
                username: data.username
            },
            function (error, user) {
                if (error) {
                    deferred.reject(error);

                    return;
                }

                if (!user) {
                    deferred.reject(new Error('User with this email doesn\'t exist'));

                    return;
                }

                if (isExpired(data.token)) {
                    user.passRecoveryToken = undefined;
                    user.passRecoveryCreatedAt = undefined;

                    user.save(function (error) {
                        if (error) {
                            deferred.reject(error);

                            return;
                        }

                        deferred.reject(new Error('Passed token is expired for user: {user}.'
                            .replace('{user}', data.username)));
                    });
                } else {
                    if (user.passRecoveryToken === data.token) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(new Error('Passed token doesn\'t exist for user: {user}'
                                .replace('{user}', data.username)));
                    }
                }
            }
        );

        return deferred.promise;

        /**
         * Check whether given date is expired
         *
         * @param {string} requiredDate
         *
         * @returns {boolean}
         */
        function isExpired (requiredDate) {
            requiredDate = new Date(requiredDate);

            return new Date() >= requiredDate.setHours(requiredDate.getHours() + expirationPeriod);
        }
    },
    /**
     * Changes password of existing user
     *
     * @param {Object} data
     * @param {string} data.username - email in fact
     * @param {string} data.newPassword
     *
     * @returns {promise}
     */
    changePassword: function (data) {
        var deferred = Q.defer();
        var result = {
            success: true,
            message: 'Password has been successfully changed'
        };

        UserModel.findOne(
            {
                username: data.username
            },
            function (error, user) {
                if (error) {
                    deferred.reject(error);

                    return;
                }

                if (!user) {
                    deferred.reject(new Error('User with this email doesn\'t exist'));

                    return;
                }

                user.password = data.newPassword;
                user.passRecoveryToken = undefined;
                user.passRecoveryCreatedAt = undefined;

                user.save(function (error) {
                    if (error) {
                        deferred.reject(error);

                        return;
                    }

                    deferred.resolve(result);
                });
            }
        );

        return deferred.promise;
    }
};

module.exports = userController;
