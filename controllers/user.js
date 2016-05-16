/// Libs
var _ = require('underscore');
var Logger = require('../libs/log');
var Q = require('q');
/// Models
var UserModel = require('../models/auth/user');
/// Local variables
var logger = Logger(module);
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
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (user) {
                    logger.error('User with this email doesn\'t exist');
                    deferred.reject(new Error('User with this email already exists'));

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
        var deferred = Q.defer();
        var result = {
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
    }
};

module.exports = userController;
