/// Libs
var config = require('../libs/config');
var emailSender = require('../utils/emailSender');
var oauth2 = require('../libs/oauth2');
/// Controllers
var userController = require('../controllers/user.js');
var url = require('url');

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
        userController.generatePassRecoveryToken(req.body.username)
            .then(function (user) {
                var passRecoveryUrl;

                passRecoveryUrl = url.format({
                    protocol: config.get('protocol') || 'http',
                    hostname: config.get('host'),
                    pathname: config.get('baseUrl') + recoverPasswordPath,
                    port: config.get('port'),
                    query: {
                        username: user.username,
                        token: user.passRecoveryToken
                    }

                });

                return emailSender.passwordRecovery(user.username, passRecoveryUrl);
            })
            .then(function (result) {
                if (result.indexOf('OK') <= -1) {
                    result = {
                        success: false,
                        message: 'Fail to send email to user: ' + req.body.username
                    };
                } else {
                    result = {
                        success: true,
                        message: 'Password recovery token has been successfully generated. ' +
                                'Notification email has been sent to user'
                    };
                }

                res.json(result);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    router.get(recoverPasswordPath, function (req, res) {
        userController.isPassRecoveryTokenExpired(req.query)
            .then(function (result) {
                res.json(result);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });
    
    router.post(recoverPasswordPath, function (req, res) {
        userController.isPassRecoveryTokenExpired(req.query)
            .then(function () {
                return userController.changePassword({
                    username: req.query.username,
                    newPassword: req.body.newPassword
                });
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
