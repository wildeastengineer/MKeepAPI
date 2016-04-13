var config = require('../libs/config');
var mongoose = require('mongoose');

var AccessTokenModel = require('../models/auth/accessToken');
var ClientModel = require('../models/auth/client');
var RefreshTokenModel = require('../models/auth/refreshToken');
var UserModel = require('../models/auth/user');

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

console.log('Connect to database:', config.get('mongoose:uri'));
mongoose.connect(config.get('mongoose:uri'));

console.log('Remove all users');
UserModel.remove({}, function () {
    var i;
    var user;

    for (i = 0; i < users.length; i++) {
        user = new UserModel(users[i]);
        user.save(function (err, user) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('New user - ${username}:${password}'
                    .replace('${username}', user.username)
                    .replace('${password}', user.password));
            }
        });
    }
});

console.log('Remove all clients');
ClientModel.remove({}, function () {
    var client;
    var i;

    for (i = 0; i < clients.length; i++) {
        client = new ClientModel(clients[i]);
        client.save(function (err, client) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('New client - ${clientId}:${clientSecret}'
                    .replace('${clientId}', client.clientId)
                    .replace('${clientSecret}', client.clientSecret));
            }
        });
    }
});

console.log('Remove all access tokens');
AccessTokenModel.remove({}, function (err) {
    if (err) {
        console.log('Error', err);
    }
});

console.log('Remove all refresh tokens');
RefreshTokenModel.remove({}, function (err) {
    if (err) {
        console.log('Error', err);
    }
});
