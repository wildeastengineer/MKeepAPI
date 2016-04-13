var config = require('./config');
var crypto = require('crypto');
var oauth2orize = require('oauth2orize');
var passport = require('passport');

var AccessTokenModel = require('../models/auth/accessToken');
var ClientModel = require('../models/auth/client');
var RefreshTokenModel = require('../models/auth/refreshToken');
var UserModel = require('../models/auth/user');

var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;

var server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(
    oauth2orize.exchange.password(function (client, username, password, scope, done) {
    UserModel.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        if (!user.checkPassword(password)) {
            return done(null, false);
        }

        RefreshTokenModel.remove({
            userId: user.userId,
            clientId: client.clientId
        }, function (err) {
            if (err) {
                return done(err);
            }
        });

        AccessTokenModel.remove({
            userId: user.userId,
            clientId: client.clientId
        }, function (err) {
            if (err) {
                return done(err);
            }
        });

        var tokenValue = crypto.randomBytes(32).toString('base64');
        var refreshTokenValue = crypto.randomBytes(32).toString('base64');
        var token = new AccessTokenModel({
            token: tokenValue,
            clientId: client.clientId,
            userId: user.userId
        });
        var refreshToken = new RefreshTokenModel({
            token: refreshTokenValue,
            clientId: client.clientId,
            userId: user.userId
        });
        refreshToken.save(function (err) {
            if (err) {
                return done(err);
            }
        });

        var info = {scope: '*'};

        token.save(function (err, token) {
            if (err) {
                return done(err);
            }

            done(null, tokenValue, refreshTokenValue, {
                'expires_in': config.get('security:tokenLife')
            });
        });
    });
})
);

// Exchange refreshToken for access token.
server.exchange(
    oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({
        token: refreshToken
    }, function (err, token) {
        if (err) {
            return done(err);
        }

        if (!token) {
            return done(null, false);
        }

        if (!token) {
            return done(null, false);
        }

        UserModel.findById(token.userId, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            RefreshTokenModel.remove({
                userId: user.userId,
                clientId: client.clientId
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });

            AccessTokenModel.remove({
                userId: user.userId,
                clientId: client.clientId
            }, function (err) {
                if (err) {
                    return done(err);
                }
            });

            var tokenValue = crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');
            var token = new AccessTokenModel({
                token: tokenValue,
                clientId: client.clientId,
                userId: user.userId
            });
            var refreshToken = new RefreshTokenModel({
                token: refreshTokenValue,
                clientId: client.clientId,
                userId: user.userId
            });

            refreshToken.save(function (err) {
                if (err) {
                    return done(err);
                }
            });

            var info = {
                scope: '*'
            };

            token.save(function (err, token) {
                if (err) {
                    return done(err);
                }

                done(null, tokenValue, refreshTokenValue, {
                    'expires_in': config.get('security:tokenLife')
                });
            });
        });
    });
})
);

passport.use(new BasicStrategy(
    function (username, password, done) {
        ClientModel.findOne({
            clientId: username
        }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret != password) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        ClientModel.findOne({
            clientId: clientId
        }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret != clientSecret) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function (accessToken, done) {
        AccessTokenModel.findOne({
            token: accessToken
        }, function (err, token) {
            var tokenLifeTime;

            if (err) {
                return done(err);
            }

            if (!token) {
                return done(null, false);
            }

            tokenLifeTime = Math.round((Date.now() - token.created) / 1000);

            if (tokenLifeTime > config.get('security:tokenLife')) {
                AccessTokenModel.remove({
                    token: accessToken
                }, function (err) {
                    if (err) {
                        return done(err);
                    }
                });

                return done(null, false, {
                    message: 'Token expired'
                });
            }

            UserModel.findById(token.userId, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }

                done(null, user, {
                    scope: '*'
                });
            });
        });
    }
));

// token endpoint
module.exports.token = [
    passport.authenticate([
        'basic',
        'oauth2-client-password'
    ], {
        session: false
    }),
    server.token(),
    server.errorHandler()
];
