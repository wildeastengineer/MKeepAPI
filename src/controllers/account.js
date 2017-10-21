/// Libs
const _ = require('underscore');
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const AccountModel = require('../models/account');
const ProjectModel = require('../models/project');
/// Controllers
/// Local variables
let logger = Logger(module);

/**
 * Accounts controller.
 * @class controllers/Account
 */
module.exports = {
    /**
     * Create new account and add it to the give project
     *
     * @function
     * @name post
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {Object} data.account
     * @param {String} data.account.name
     * @param {Number} data.account.value
     * @param {Number} data.account.initValue
     * @param {?(ObjectId|String)[]} data.account.projects
     * @param {(ObjectId|String)} data.account.currency
     * @param {(ObjectId|String)} data.projectId - Project's id
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    post(data) {
        let deferred = Q.defer();
        let newAccount;

        newAccount = new AccountModel({
            name: data.account.name,
            owners: [data.userId],
            users: [data.userId],
            value: data.account.value,
            initValue: data.account.initValue,
            currency: data.account.currency,
            projects: data.account.projects,
            created: new Date(),
            createdBy: data.userId,
            modifiedBy: data.userId
        });

        newAccount.save((error, account) => {
            if (error) {
                logger.error('New account hasn\'t been created');
                logger.error(error);
                deferred.reject(error);

                return;
            }

            logger.info('New account has been successfully created: ' + account._id);
            deferred.resolve(account);
        });

        return deferred.promise;
    },

    /**
     * Add given account to the give project
     *
     * @function
     * @name put
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id
     * @param {(ObjectId|String)} data.projectId - Project's id
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    put(data) {
        let deferred = Q.defer();

        // Find Project and add given account to project
        ProjectModel.findOneAndUpdate({
            _id: data.projectId,
            owners: data.userId
        }, {
            $addToSet: {
                accounts: data.id
            }
        }, {
            runValidators: true
        })
            .exec((error, project) => {
                if (error) {
                    logger.error(`Account with given id "${data.id}" wasn\'t added to project "${project._id}"`);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                // Find User and add project id to projects field
                AccountModel.findOneAndUpdate({
                    _id: data.id
                }, {
                    $addToSet: {
                        projects: project._id
                    }
                }, {
                    runValidators: true
                })
                    .exec((error, doc) => {
                        if (error) {
                            logger.error(`Account with given id "${doc._id}" wasn\'t added to project "${project._id}"`);
                            logger.error(error);
                            deferred.reject(error);

                            return;
                        }

                        logger.info(`Account with given id "${doc._id}" wasn\'t added to project "${project._id}"`);
                        deferred.resolve(doc);
                    });
            });

        return deferred.promise;
    },

    /**
     * Get account by id
     *
     * @function
     * @name getById
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    getById(data) {
        let deferred = Q.defer();

        AccountModel.findOne({
            users: data.userId,
            _id: data.id
        })
            .populate('projects')
            .exec((error, account) => {
                if (error) {
                    logger.error('Account with given id wasn\'t found: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Account with given id was successfully found: ' + data.id);

                deferred.resolve(account);
            });

        return deferred.promise;
    },

    /**
     * Get list of all accounts
     *
     * @function
     * @name getAll
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/AccountSchema[]|Error>}
     */
    getAll(data) {
        let deferred = Q.defer();

        AccountModel.find({
            users: data.userId
        })
            .populate('projects')
            .exec((error, accounts) => {
                if (error) {
                    logger.error('Accounts with given user weren\'t found: ' + data.userId);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Accounts with given user were successfully found: ' + data.userId);
                deferred.resolve(accounts);
            });

        return deferred.promise;
    },


    /**
     * Update account
     *
     * @function
     * @name update
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {Object} data.account
     * @param {(ObjectId|String)} data.account.id - account id
     * @param {?String} data.account.name
     * @param {?(ObjectId|String)} data.account.currency
     * @param {?Number} data.account.value
     * @param {?Number} data.account.initValue
     * @param {?(ObjectId|String)[]} data.account.projects
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    update(data) {
        let deferred = Q.defer();

        AccountModel.findOneAndUpdate({
            _id: data.account.id,
            owners: data.userId
        }, {
                $set: data.account
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .exec((error, doc) => {
                if (error) {
                    logger.error('Account was not updated: ' + doc._id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                //TODO: changing value, initialValue and currency should lead to recalculating all transactions
                logger.info('Account was successfully updated: ' + doc._id);
                deferred.resolve(doc);
            });

        return deferred.promise;
    },

    /**
     * Delete given account
     *
     * @function
     * @name delete
     * @memberof controllers/Account
     * @param {(ObjectId|String)} data.id - account id
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<void|Error>}
     */
    delete(data) {
        let deferred = Q.defer();
        let that = this;

        AccountModel.findOneAndRemove({
            _id: data.id,
            owners: data.userId
        },{
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .exec((error, account) => {
                if (error) {
                    logger.error('Account with given id was not deleted: ' + account._id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                //Delete Account from all projects
                that.deleteAccountFromProjects(data)
                    .then(() => {
                        logger.info('Account with given id was deleted: ' + account._id);
                        deferred.resolve();
                    })
                    .fail((error) => {
                        deferred.reject(error);
                    });
            });

        return deferred.promise;
    },

    deleteAccountFromProjects(data) {
        let deferred = Q.defer();

        ProjectModel.update({
            _id: {
                "$in":data.projects
            }
        }, {
            $pull: {
                accounts: {
                    _id: data._id
                }
            }
        }, {
            runValidators: true,
            new: true, //return the modified document rather than the original
            multi: true
        })
            .exec((error, docs) => {
                if (error) {
                    logger.error('Account with given id was not removed from existing projects: ' + data._id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }


                logger.info('Account with given id was removed from existing projects: ' + data._id);
                deferred.resolve();
            });

        return deferred.promise;
    },

    recalculate: function (accountId, callback) {
        console.log('recalculate');

        let accountValue;

        Account.findOne({
            _id: accountId,
            _owner: user._id
        })
            .exec(function (err, account) {
                if (err) {
                    callback(err);

                    return;
                }

                accountValue = account.initValue;
                console.log('init value', account.initValue);

                Transaction.find(
                    {
                        _owner: user._id,
                        accountSource: accountId
                    })
                    .exec(function (err, transactions) {
                        if (err) {
                            callback(err);

                            return;
                        }

                        for (let i = 0; i < transactions.length; i++) {
                            let transaction = transactions[i];

                            if (transaction.type === 'income') {
                                accountValue += transaction.value;
                            } else {
                                accountValue -= transaction.value;
                            }
                        }

                        Transaction.find(
                            {
                                _owner: user._id,
                                accountDestination: accountId
                            })
                            .exec(function (err, transactions) {
                                if (err) {
                                    callback(err);

                                    return;
                                }

                                for (let i = 0; i < transactions.length; i++) {
                                    let transaction = transactions[i];

                                    accountValue += transaction.value;
                                }

                                account.value = accountValue;
                                account.save(callback);
                            });
                    });
            });


    }
};
