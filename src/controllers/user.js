/// Libs
const config = require('../libs/config');
const crypto = require('crypto');
const _ = require('underscore');
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const AccessTokenModel = require('../models/auth/accessToken');
const ClientModel = require('../models/auth/client');
const UserModel = require('../models/auth/user');
const RefreshTokenModel = require('../models/auth/refreshToken');
/// Local variables
let logger = Logger(module);
let userController = {
    /**
     * Create new user.
     *
     * @param {Object} data
     * @param {string} data.username - email in fact
     * @param {string} data.password
     * @param {string} data.clientId
     *
     * @returns {Promise.<Object, Error>} user's profile with access and refresh tokens
     * if fulfilled, or an error if rejected.
     */
    createUser: function (data) {
        const deferred = Q.defer();

        UserModel.findOne(
            {
                username: data.username
            },
            (error, user) => {
                if (error && error.name.toLowerCase() !== 'NotFoundError'.toLowerCase()) {
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (user) {
                    error = {
                        name: 'ValidationError',
                        message: `User with this email ${data.username} already exist`
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                const newUser = new UserModel({
                    username: data.username,
                    password: data.password,
                    created: new Date()
                });

                newUser.save((error, user) => {
                    if (error) {
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    Q.all([
                        createAccessToken(user._id, data.clientId),
                        createRefreshToken(user._id, data.clientId)
                    ])
                        .then(function(tokens) {
                            let response = {};

                            response.access_token = tokens[0];
                            response.refresh_token = tokens[1];
                            response.expires_in = config.get('security:tokenLife');
                            response.userProfile = user;

                            logger.info('New User has been successfully created: ' + user._id);
                            deferred.resolve(response);
                        })
                        .catch(function (error) {
                            logger.error(error);
                            deferred.reject(error);
                        });
                });
            }
        );

        return deferred.promise;

        /**
         * Create new access token.
         *
         * @param {string} userId
         * @param {string} clientId
         *
         * @returns {Promise.<string, Error>} access token if fulfilled, or an error if rejected.
         */
        function createAccessToken(userId, clientId) {
            const deferred = Q.defer();

            ClientModel.findOne(
                {
                    clientId: clientId
                },
                (error, client) => {
                    if (error) {
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    const accessTokenValue = crypto.randomBytes(16).toString('hex');
                    const newAccessToken = new AccessTokenModel({
                        token: accessTokenValue,
                        clientId: client.clientId,
                        userId: userId
                    });

                    newAccessToken.save(function (error, token) {
                        if (error) {
                            logger.error(error);
                            deferred.reject(error);
                        } else {
                            logger.info('New Access Token created for user: ' + userId);
                            deferred.resolve(token.token);
                        }
                    });
                }
            );

            return deferred.promise;
        }

        /**
         * Create new refresh token.
         *
         * @param {string} userId
         * @param {string} clientId
         *
         * @returns {Promise.<string, Error>} refresh token if fulfilled, or an error if rejected.
         */
        function createRefreshToken(userId, clientId) {
            const deferred = Q.defer();

            ClientModel.findOne(
                {
                    clientId: clientId
                },
                (error, client) => {
                    if (error) {
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    const refreshTokenValue = crypto.randomBytes(16).toString('hex');
                    const newRefreshToken = new RefreshTokenModel({
                        token: refreshTokenValue,
                        clientId: client.clientId,
                        userId:  userId
                    });

                    newRefreshToken.save(function (error, token) {
                        if (error) {
                            logger.error(error);
                            deferred.reject(error);
                        } else {
                            logger.info('New Refresh Token created for user: ' + userId);
                            deferred.resolve(token.token);
                        }
                    });
                }
            );

            return deferred.promise;
        }
    },
    /**
     * Changes password of existing user.
     *
     * @param {Object} data
     * @param {string} data.username - email in fact
     * @param {string} data.newPassword
     *
     * @returns {promise}
     */
    changePassword: function (data) {
        const deferred = Q.defer();
        let result = {
            success: true,
            message: 'Password has been successfully changed for {user}'.replace('{user}', data.username)
        };

        UserModel.findOne(
            {
                username: data.username
            },
            (error, user) => {
                if (error) {
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (!user) {
                    logger.error('Cannot change password. User with this email doesn\'t exist: ' + user.username);
                    deferred.reject(new Error('Cannot change password. User with this email doesn\'t exist: '
                            + user.username));

                    return;
                }

                user.password = data.newPassword;

                user.save((error) => {
                    if (error) {
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    logger.info(result.message);
                    deferred.resolve(result);
                });
            }
        );

        return deferred.promise;
    },

    /**
     * Get user by given id.
     *
     * @param {Object} data
     * @param {ObjectId | string} data.id
     *
     * @returns {promise}
     */
    getById: function (data) {
        const deferred = Q.defer();

        UserModel.findOne({
            _id: data.id
        })
            .exec((error, user) => {
                if (!user) {
                    error = {
                        name: 'NotFoundError',
                        message: 'User with given id wasn\'t found: ' + data.id
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (error) {
                    logger.error('User with given id wasn\'t found: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);
                } else {
                    logger.info('User with given id was successfully found: ' + data.id);
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    },

    /**
     * Update given user
     *
     * @function
     * @name updateUser
     * @memberof controllers/User
     * @param {(ObjectId|String)} data.id
     * @param {?String} data.username - user's email
     * @param {?String} data.lang
     *
     * @returns {Promise.<Object, Error>} user schema if fulfilled, or an error if rejected.
     */
    updateUser (data) {
        const deferred = Q.defer();
        const paramsToSet = {};

        //define params for updating
        for (let paramName of Object.keys(data)) {
            if (data[paramName] && paramName !== 'id') {
                paramsToSet[paramName] = data[paramName]
            }
        }

        if (_.isEmpty(paramsToSet)) {
            const error = {
                name: 'ValidationError',
                message: 'There are no updates for user : ' + data.id
            };

            logger.error(error);
            deferred.reject(error);

            return deferred.promise;
        }

        paramsToSet.modified = new Date();

        UserModel.findOneAndUpdate({
            _id: data.id
        }, {
            $set: paramsToSet
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .exec((error, user) => {
                if (error) {
                    logger.error('User given id was not updated: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (!user) {
                    error = {
                        name: 'NotFoundError',
                        message: 'User with given id was not found after updating: ' + data.id
                    };

                    logger.error(error);
                    deferred.reject(error);

                    return deferred.promise;
                }

                logger.info('User with given id was successfully updated: ' + data.id);
                deferred.resolve(user);
            });

        return deferred.promise;
    }
};

module.exports = userController;
