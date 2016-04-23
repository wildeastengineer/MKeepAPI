/// Libs
var oauth2 = require('../libs/oauth2');
/// Controllers
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
        })
    });

    router.post('/send-change-password-secret', function (req, res) {
        userController.generatePassRecoveryToken({
            username: req.body.username
        })
        .then(function (result) {
            res.json(result)
        })
        .fail(function (error) {
            sendError(error, res);
        });
    })
};

module.exports = {
    register: userRegisterRoutes
};
