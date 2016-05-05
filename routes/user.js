/// Libs
var config = require('../libs/config');
var emailSender = require('../utils/emailSender');
var oauth2 = require('../libs/oauth2');
var url = require('url');
/// Controllers
var userController = require('../controllers/user.js');
var passRecovery = require('../controllers/passRecovery.js');


var userRegisterRoutes = function (router, authenticate, sendError) {
    var recoverPasswordPath = '/recover-password';

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
        })
    });

    router.post('/send-recover-password-token', function (req, res) {
        passRecovery.createPassRecoveryToken(req.body.username)
            .then(function (token) {
                var passRecoveryUrl;

                passRecoveryUrl = url.format({
                    protocol: config.get('protocol') || 'http',
                    hostname: config.get('host'),
                    pathname: config.get('baseUrl') + recoverPasswordPath,
                    port: config.get('port'),
                    query: {
                        username: req.body.username,
                        token: token.token
                    }

                });

                return emailSender.passwordRecovery(req.body.username, passRecoveryUrl);
            })
            .then(function (result) {
                res.json(result);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    router.get(recoverPasswordPath, function (req, res) {
        passRecovery.exists(req.query.token)
            .then(function (result) {
                res.json(result);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });
    
    router.post(recoverPasswordPath, function (req, res) {
        passRecovery.removePassRecoveryToken(req.query.token)
            .then(function () {
                return userController.changePassword({
                    username: req.query.username,
                    newPassword: req.body.newPassword
                })
            })
            .then(function (result) {
                res.json(result)
            })
            .fail(function (error) {
                sendError(error, res);
            })
    })
};

module.exports = {
    register: userRegisterRoutes
};
