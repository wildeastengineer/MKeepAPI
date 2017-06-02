/// Libs
const crypto = require('crypto');
const Logger = require('../libs/log');
const Q = require('q');
/// Local variables
const logger = Logger(module);

/**
 * Migration that creates Basic clients that are used for authentication process
 *
 * @param {DataBaseInstance} db
 *
 * @returns {Promise.<undefined,Error>} returns undefined if fulfilled, or an error if rejected.
 */
const createBasicUsers = {
    execute: function (db) {
        const collectionName = 'clients';
        const deferred = Q.defer();
        const Client = class Client {
            constructor(name, id, secret) {
                this.name = name;
                this.clientId = id;
                this.clientSecret = secret;
            }
        };
        const clients = [
            new Client('MK web application v1', 'MKWebAppV1', 'mbO2FdS451lEz0fM8FlSM3n1rbokBSyy'),
            new Client('MK mobile application v1', 'MKMobileAppV1', '973fe85ea429112e5261a7413a33220aefebaaf1')
        ];

        const clientsCollection = db.collection(collectionName);

        clientsCollection.createIndex({
            name: 1,
            clientId: 1,
            clientSecret: 1
        }, {
            unique: true
        })
            .catch((error) => {
                deferred.reject(error);

                return deferred.promise;
            })
            .then(() => {
                const clientsToInsert = [];

                for (let client of clients) {
                    clientsToInsert.push(insertBasicClient(client));
                }

                Q.all(clientsToInsert)
                    .catch((err) => {
                        deferred.reject(err);
                    })
                    .done((insertedClients) => {
                        deferred.resolve();
                    });

                /**
                 * Inserts Client record into DB if one doesn't exist
                 *
                 * @param {Object} client
                 * @param {string} client.name
                 * @param {string} client.clientId
                 * @param {string} client.clientSecret
                 *
                 * @returns {Promise.<Object, Error>} returns an object
                 * that contains the status of the operation if fulfilled, or an error if rejected.
                 */
                function insertBasicClient(client) {
                    return clientsCollection.findOne({
                        clientId: client.clientId
                    }).then((existingClient)=>{
                        if (existingClient) {
                            
                            logger.info(`Basic Client '${client.name}' already exists. Don't need to create it`);
                            return;
                        }

                        logger.info(`Create Basic Client '${client.name}'`);
                        return clientsCollection.insert(client);
                    });
                }
            });

        return deferred.promise;
    }
};

module.exports = createBasicUsers;
