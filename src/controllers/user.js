/// Libs
const _ = require('underscore');
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const UserModel = require('../models/auth/user');
/// Local variables
let logger = Logger(module);
let userController = {
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
        let deferred = Q.defer();

        UserModel.findOne(
            {
                username: data.username
            },
            function (error, user) {
                let newUser;

                if (error) {
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (user) {
                    error = {
                        name: 'ValidationError',
                        message: 'User with this email already exist'
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                newUser = new UserModel({
                    username: data.username,
                    password: data.password,
                    created: new Date()
                });

                newUser.save(function (error, user) {
                    if (error) {
                        logger.error(error);
                        deferred.reject(error);
                    } else {
                        logger.info('New User has been successfully created: ' + user);
                        deferred.resolve(_.pick(user, 'username', 'created'));
                    }
                });
            }
        );

        return deferred.promise;
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
        let deferred = Q.defer();
        let result = {
            success: true,
            message: 'Password has been successfully changed for {user}'.replace('{user}', data.username)
        };

        UserModel.findOne(
            {
                username: data.username
            },
            function (error, user) {
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

                user.save(function (error) {
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
     * Get user by given id
     * @param {Object} data
     * @param {ObjectId | string} data.id
     *
     * @returns {promise}
     */
    getById: function (data) {
        let deferred = Q.defer();

        UserModel.findOne({
            _id: data.id
        })
            .exec(function (error, user) {
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
    }
};

module.exports = userController;
