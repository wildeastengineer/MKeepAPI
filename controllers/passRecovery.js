/// Libs
var Logger = require('../libs/log');
var Q = require('q');
/// Models
var UserModel = require('../models/auth/user');
var PassRecoveryTokenModel = require('../models/passRecoveryToken');
/// Local variables
var logger = Logger(module);

var passRecoveryController = {
    /**
     * Generate password recovery token
     *
     * @param {string} username - email in fact
     *
     * @returns {promise}
     */
    createPassRecoveryToken: function (username) {
        var deferred = Q.defer();

        UserModel.findOne(
            {
                username: username
            },
            function (error, user) {
                var newPassRecoveryToken;
                var token;

                if (error) {
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (!user) {
                    logger.error('Cannot create password recovery token. ' +
                            'User with this email doesn\'t exist' + username);
                    deferred.reject(new Error('Cannot create password recovery token. ' +
                            'User with this email doesn\'t exist' + username));

                    return;
                }

                token = user.username + Date.parse(new Date);
                newPassRecoveryToken = new PassRecoveryTokenModel({
                    userId: user._id,
                    token: user.encryptPassword(token),
                    created: new Date()
                });

                newPassRecoveryToken.save(function (error, token) {
                    if (error) {
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    } else {
                        logger.info('New password recovery token has been successfully created: ' + token);
                        deferred.resolve(token);
                    }
                });
            }
        );

        return deferred.promise;
    },

    /**
     * Check whether given token does exist in data base
     *
     * @param {string} token - password recovery token that is passed as param in url
     *
     * @returns {promise}
     */
    isPasswordRecoveryTokenExisting: function (token) {
        var deferred = Q.defer();
        var result = {
            message: 'Password recovery token exists and is not expired',
            success: true
        };

        PassRecoveryTokenModel.findOne(
            {
                token: token
            },
            function (error, token) {
                if (error) {
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (!token) {
                    logger.error('Password recovery token doesn\'t exist');
                    deferred.reject(new Error('Password recovery token doesn\'t exist'));

                    return;
                }

                logger.info(result.message + ': ' + token._id);
                deferred.resolve(result);
            }
        );

        return deferred.promise;
    },

    /**
     * Remove given password recovery token from data base
     *
     * @param {string} token - password recovery token that is passed as param in url
     *
     * @returns {promise}
     */
    removePassRecoveryToken: function (token) {
        var deferred = Q.defer();

        PassRecoveryTokenModel.findOneAndRemove(
            {
                token: token
            },
            function (error, token) {
                if (error) {
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (!token) {
                    logger.error('Cannot remove Password recovery token. It doesn\'t exist');
                    deferred.reject(new Error('Cannot remove Password recovery token. It doesn\'t exist'));

                    return;
                }

                logger.info('Password recovery token has been successfully deleted: ' + token);
                deferred.resolve(token);
            });

        return deferred.promise;
    }
};

module.exports = passRecoveryController;
