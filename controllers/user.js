var config = require('../libs/config');
var crypto = require('crypto');
var _ = require('underscore');
var Q = require('q');
var emailSender = require('../utils/emailSender');
var url = require('url');

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
    generatePassRecoveryToken: function (data) {
        var deferred = Q.defer();
        var passRecoveryUrl;

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
                    deferred.reject(new Error('User with this email doe\'t exist'));

                    return;
                }

                user.passRecoveryToken = generateRecoveryToken(user);
                user.passRecoveryCreatedAt = new Date();

                passRecoveryUrl = url.format({
                    protocol: config.get('protocol') || 'http',
                    hostname: config.get('host'),
                    port: config.get('port'),
                    query: {
                        username: user.username,
                        token: user.passRecoveryToken
                    }

                });

                user.save(function (error) {
                    if (error) {
                        deferred.reject(error);

                        return;
                    }

                    emailSender.generatePassRecoveryToken(user.username, passRecoveryUrl)
                        .then(function () {
                            deferred.resolve(user);
                        });
                });
            }
        );

        return deferred.promise;

        function generateRecoveryToken (user) {
            var encryptedRecoveryToken;
            var plainRecoveryToken = user.username + Date.parse(new Date);

            encryptedRecoveryToken = crypto.createHmac('sha1', user.salt).update(plainRecoveryToken).digest('hex');

            return encryptedRecoveryToken;
        }
    }
};

module.exports = userController;
