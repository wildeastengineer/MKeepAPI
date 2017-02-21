/// Libs
const config = require('../libs/config');
const emailSender = require('../utils/emailSender');
const oauth2 = require('../libs/oauth2');
const url = require('url');
/// Controllers
const passRecovery = require('../controllers/passRecovery.js');
const userController = require('../controllers/user.js');

/**
 * Users routes.
 * @class routes/User
 */
let userRegisterRoutes = function (router, authenticate) {
    /**
     * Create new user.
     *
     * @function
     * @name POST: /registration
     * @memberof routes/User
     *
     * @param {String} username
     * @param {String} password
     *
     * @returns {models/UserSchema} user - Created user.
     */
    router.post('/registration', function (req, res, next) {
        userController.createUser({
            username: req.body.username,
            password: req.body.password
        })
            .then(function (user) {
                res.json(user);
            })
            .fail(function (error) {
                next(error);
            });
    });

    // Register authentication routes

    /**
     * Authenticate user.
     *
     * @function
     * @name POST: /authenticate
     * @memberof routes/User
     */
    router.post('/authenticate', oauth2.token);

    /**
     * Get user's profile.
     *
     * @function
     * @name GET: /profile
     * @memberof routes/User
     *
     * @returns {models/UserSchema} user
     */
    router.get('/profile', authenticate, function (req, res, next) {
        userController.getById({
            id: req.user._id
        })
            .then(function (user) {
                res.json(user);
            })
            .fail(function (error) {
                next(error);
            });
    });

    /**
     * Request password recovery token.
     *
     * @function
     * @name POST: /send-recover-password-token
     * @memberof routes/User
     *
     * @param {String} username
     *
     * @returns {Object} result
     * @returns {Boolean} result.success
     * @returns {String} result.message
     */
    router.post('/send-recover-password-token', function (req, res, next) {
        passRecovery.createPassRecoveryToken(req.body.username)
            .then(function (token) {
                let redirectUrl;

                redirectUrl = url.parse(req.body.redirectUrl, true);
                redirectUrl.query.username = req.body.username;
                redirectUrl.query.token = token.token;

                redirectUrl = url.format({
                    protocol: redirectUrl.protocol,
                    hostname: redirectUrl.hostname,
                    port: redirectUrl.port,
                    pathname: redirectUrl.pathname,
                    query: redirectUrl.query
                });

                return emailSender.passwordRecovery(req.body.username, redirectUrl);
            })
            .then(function (result) {
                res.json(result);
            })
            .fail(function (error) {
                next(error);
            });
    });

    /**
     * Change user's password.
     *
     * @function
     * @name POST: /recover-password
     * @memberof routes/User
     *
     * @param {String} username
     * @param {String} newPassword
     * @param {String} token
     *
     * @returns {Object} result
     * @returns {Boolean} result.success
     * @returns {String} result.message
     */
    router.post('/recover-password', function (req, res, next) {
        passRecovery.isPasswordRecoveryTokenExisting(req.body.token)
            .then(function () {
                passRecovery.removePassRecoveryToken(req.body.token)
            })
            .then(function () {
                return userController.changePassword({
                    username: req.body.username,
                    newPassword: req.body.newPassword
                })
            })
            .then(function (result) {
                res.json(result)
            })
            .fail(function (error) {
                next(error);
            });
    });
};

module.exports = {
    register: userRegisterRoutes
};
