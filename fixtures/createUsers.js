var mongoose = require('mongoose');
var UserModel = require('../models/auth/user');
var ClientModel = require('../models/auth/client');
var AccessTokenModel = require('../models/auth/accessToken');
var RefreshTokenModel = require('../models/auth/refreshToken');
var faker = require('Faker');
var config = require('../libs/config');

var users = [
    {
        username: 'andrey',
        password: '123456'
    },
    {
        username: 'dmitry',
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

    for (i = 0; i < 4; i++) {
        user = new UserModel({
            username: faker.random.first_name().toLowerCase(),
            password: faker.Lorem.words(1)[0]
        });

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
