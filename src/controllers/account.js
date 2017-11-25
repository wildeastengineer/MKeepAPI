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
     * @name put
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.account
     * @param {String} data.account.name
     * @param {Number} data.account.initValue
     * @param {?(ObjectId|String)} data.account.currency
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    put(data) {
        let deferred = Q.defer();

        if (!data.account) {
            const error = {
                name: 'ValidationError',
                message: 'Project account were not specified'
            };

            logger.error(error);
            deferred.reject(error);

            return deferred.promise;
        }

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            $push: {
                accounts: {
                    name: data.account.name,
                    initValue: data.account.initValue,
                    value: data.account.initValue, //value should be equal to initValue when new acc is created
                    currency: data.account.currency,
                    created: new Date(),
                    createdBy: data.userId,
                    modifiedBy: data.userId,
                    modified: new Date()
                }
            }
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .populate('accounts accounts.currency')
            .exec((error, doc) => {
                if (error) {
                    logger.error('Account was not added to project: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Account was successfully added to project: ' + data.id);
                //TODO: better way to return what was added since returning the last in the list
                // might be added by another call in theory
                deferred.resolve(doc.accounts.pop());
            });

        return deferred.promise;
    },

    /**
     * Get accounts by project id
     *
     * @function
     * @name getAll
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/AccountSchema[]|Error>}
     */
    getAll(data) {
        let deferred = Q.defer();

        ProjectModel.findOne({
            _id: data.id
        })
            .populate('accounts accounts.currency')
            .exec((error, doc) => {
                if (error) {
                    logger.error('Accounts of the project with given id were\'t found: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Accounts of the project with given id were successfully found: ' + data.id);
                deferred.resolve(doc.accounts);
            });

        return deferred.promise;
    },

    /**
     * Update account
     *
     * @function
     * @name updateAccount
     * @memberof controllers/Account
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.account
     * @param {(ObjectId|String)} data.account.id - account id
     * @param {?String} data.account.name
     * @param {?(ObjectId|String)} data.account.currency
     * @param {?Number} data.account.initValue
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    updateAccount(data) {
        //TODO: calculated calculatedValue when transactions are implemented
        let calculatedValue = data.account.initValue;
        let deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId,
            'accounts._id': data.account.id
        }, {
            $set: {
                'accounts.$.name': data.account.name,
                'accounts.$.initValue': data.account.initValue,
                'accounts.$.value': calculatedValue,
                'accounts.$.currency': data.account.currency,
                'accounts.$.modifiedBy': data.userId,
                'accounts.$.modified': new Date()
            }
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .populate('accounts accounts.currency')
            .exec((error, doc) => {
                let updatedAccount;

                if (error) {
                    logger.error('Account of the project with given id was not updated: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                updatedAccount = doc.accounts.find(function (account) {
                    return account._id.toString() === data.account.id.toString()
                });

                if (!updatedAccount) {
                    error = {
                        name: 'NotFoundError',
                        message: 'Account of the project with given id was not found after updating: ' + data.id
                    };

                    logger.error(error);
                    deferred.reject(error);

                    return deferred.promise;
                }

                logger.info('Account of the project with given id was successfully changed: ' + data.id);
                deferred.resolve(updatedAccount);
            });

        return deferred.promise;
    },

    /**
     * Delete given account from project
     *
     * @function
     * @name deleteAccount
     * @memberof controllers/Account
     *
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.accountId
     *
     * @returns {Promise<void|Error>}
     */
    deleteAccount(data) {
        let deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId,
            'accounts._id': data.accountId
        }, {
            $pull: {
                accounts: {
                    _id: data.accountId
                }
            }
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .exec((error, doc) => {
                if (error) {
                    logger.error('Account of the project with given id was not deleted: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Account of the project with given id was successfully deleted: ' + data.id);
                deferred.resolve();
            });

        return deferred.promise;
    }
};
