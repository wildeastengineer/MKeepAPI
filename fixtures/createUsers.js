/// Libs
var config = require('../libs/config');
var Logger = require('./libs/log');
var mongoose = require('mongoose');
/// Models
var AccessTokenModel = require('../models/auth/accessToken');
var ClientModel = require('../models/auth/client');
var RefreshTokenModel = require('../models/auth/refreshToken');
var UserModel = require('../models/auth/user');
/// Local variables
var logger = Logger(module);

var users = [
    {
        username: 'andrey@andrey.com',
        password: '123456'
    },
    {
        username: 'dimkahare@gmail.com',
        password: 'qwerty'
    }
];

var clients = config.get('clients');

logger.info('Connect to database:', config.get('mongoose:uri'));
mongoose.connect(config.get('mongoose:uri'));

logger.info('Remove all users');
UserModel.remove({}, function () {
    var i;
    var user;

    for (i = 0; i < users.length; i++) {
        user = new UserModel(users[i]);
        user.save(function (err, user) {
            if (err) {
                logger.info('Error', err);
            } else {
                logger.info('New user - ${username}:${password}'
                    .replace('${username}', user.username)
                    .replace('${password}', user.password));
            }
        });
    }
});

logger.info('Remove all clients');
ClientModel.remove({}, function () {
    var client;
    var i;

    for (i = 0; i < clients.length; i++) {
        client = new ClientModel(clients[i]);
        client.save(function (err, client) {
            if (err) {
                logger.info('Error', err);
            } else {
                logger.info('New client - ${clientId}:${clientSecret}'
                    .replace('${clientId}', client.clientId)
                    .replace('${clientSecret}', client.clientSecret));
            }
        });
    }
});

logger.info('Remove all access tokens');
AccessTokenModel.remove({}, function (err) {
    if (err) {
        logger.info('Error', err);
    }
});

logger.info('Remove all refresh tokens');
RefreshTokenModel.remove({}, function (err) {
    if (err) {
        logger.info('Error', err);
    }
});
