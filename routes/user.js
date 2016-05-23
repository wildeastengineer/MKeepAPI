/// Libs
var config = require('../libs/config');
var emailSender = require('../utils/emailSender');
var oauth2 = require('../libs/oauth2');
var url = require('url');
/// Controllers
var passRecovery = require('../controllers/passRecovery.js');
var userController = require('../controllers/user.js');

var userRegisterRoutes = function (router, authenticate, sendError) {
    router.post('/registration', function (req, res) {
        userController.createUser({
            username: req.body.username,
            password: req.body.password
        })
            .then(function (user) {
                res.json(user);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    // Register authentication routes
    router.post('/authenticate', oauth2.token);

    router.get('/profile', authenticate, function (req, res) {
        res.json({
            user_id: req.user.userId,
            name: req.user.username,
            scope: req.authInfo.scope
        });
    });

    router.post('/send-recover-password-token', function (req, res) {
        passRecovery.createPassRecoveryToken(req.body.username)
            .then(function (token) {
                var redirectUrl;

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
                sendError(error, res);
            });
    });
    
    router.post('/recover-password', function (req, res) {
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
                sendError(error, res);
            });
    });
};

module.exports = {
    register: userRegisterRoutes
};
