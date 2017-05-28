/// Libs
const crypto = require('crypto');
const Logger = require('../libs/log');
const Q = require('q');
/// Local variables
let logger = Logger(module);

let createBasicUsers = {
    execute: function (db) {
        let collectionName = 'users';
        let deferred = Q.defer();
        let usersCollection;
        let User = class User {
            constructor(username, password) {
                this.username = username;
                // That approach for user creating is used in mongoose UserModel. If mongoose approach changes
                // we need to that migration as well
                this.salt = crypto.randomBytes(32).toString('base64');
                this.hashedPassword = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            }
        };
        let users = [
            new User('surzhan.a.y@gmail.com', 'moneykeeper123456'),
            new User('dimkahare@gmail.com', 'moneykeeperqwerty')
        ];

        usersCollection = db.collection(collectionName);

        usersCollection.createIndex({
            username: 1
        }, {
            unique: true
        })
            .catch((error) => {
                deferred.reject(error);

                return deferred.promise;
            })
            .then(() => {
                let usersToInsert = [];

                for (let user of users) {
                    usersToInsert.push(insertBasicUser(user));
                }

                Q.all(usersToInsert)
                    .catch((err) => {
                        deferred.reject(err);
                    })
                    .done((insertedUsers) => {
                        deferred.resolve();
                    });

                function insertBasicUser(user) {
                    return usersCollection.findOne({
                        username: user.username
                    }).then((existingUser)=>{
                        if (existingUser) {
                            logger.info(`Basic user '${user.username}' already exists. Don't need to create it`);

                            return;
                        }

                        logger.info(`Create Basic user '${user.username}'`);
                        return usersCollection.insert(user);
                    });
                }
            });

        return deferred.promise;
    }
};

module.exports = createBasicUsers;
