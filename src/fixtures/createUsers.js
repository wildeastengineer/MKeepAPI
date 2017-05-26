"use strict";

/// Libs
const config = require('../libs/config');
const Logger = require('../libs/log');
const mongoose = require('mongoose');
/// Models
const AccessTokenModel = require('../models/auth/accessToken');
const ClientModel = require('../models/auth/client');
const RefreshTokenModel = require('../models/auth/refreshToken');
const UserModel = require('../models/auth/user');
/// Local variables
let logger = Logger(module);

let users = [
    {
        username: 'andrey@andrey.com',
        password: '123456'
    },
    {
        username: 'dimkahare@gmail.com',
        password: 'qwerty'
    }
];

let clients = config.get('clients');

logger.info('Connect to database:', config.get('database:uri'));
mongoose.connect(config.get('database:uri'));

logger.info('Remove all users');
UserModel.remove({}, function () {
    let user;

    for (let i = 0; i < users.length; i++) {
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
    let client;

    for (let i = 0; i < clients.length; i++) {
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
