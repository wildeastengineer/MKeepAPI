/// Libs
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const UserModel = require('../models/auth/user');
const PassRecoveryTokenModel = require('../models/passRecoveryToken');
/// Local variables
let logger = Logger(module);

let passRecoveryController = {
    /**
     * Generate password recovery token
     *
     * @param {string} username - email in fact
     *
     * @returns {promise}
     */
    createPassRecoveryToken: function (username) {
        let deferred = Q.defer();

        UserModel.findOne(
            {
                username: username
            },
            (error, user) => {
                let newPassRecoveryToken;
                let token;

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

                newPassRecoveryToken.save((error, token) => {
                    if (error) {
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    } else {
                        logger.info('New password recovery token has been successfully created: ' + token.userId);
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
        let deferred = Q.defer();
        let result = {
            message: 'Password recovery token exists and is not expired',
            success: true
        };

        PassRecoveryTokenModel.findOne(
            {
                token: token
            },
            (error, token) => {
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
        let deferred = Q.defer();

        PassRecoveryTokenModel.findOneAndRemove(
            {
                token: token
            },
            (error, token) => {
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

                logger.info('Password recovery token has been successfully deleted: ' + token.userId);
                deferred.resolve(token);
            });

        return deferred.promise;
    }
};

module.exports = passRecoveryController;
