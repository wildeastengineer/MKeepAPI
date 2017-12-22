/// Libs
const Logger = require('../libs/log');
const Q = require('q');
const _ = require('underscore');
/// Models
const AccountModel = require('../models/account');
const CategoryModel = require('../models/category');
const UserModel = require('../models/auth/user');
const ProjectModel = require('../models/project');
const TransactionModel = require('../models/transaction');

/// Controllers
const AccountController = require('./account');
const CategoryController = require('./category');
const CurrencyController = require('./currency');
/// Local variables
const logger = Logger(module);
/// Private functions

/**
 * Transaction controller.
 * @class controllers/Transaction
 */
module.exports = {
    /**
     * Create new transaction
     *
     * @function
     * @name addNewTransaction
     * @memberof controllers/Transaction
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.transaction
     * @param {String} data.transaction.type
     * @param {Number} data.transaction.value
     * @param {String} data.transaction.note
     * @param {?(ObjectId|String)} data.transaction.category
     * @param {?(ObjectId|String)} data.transaction.accountSource
     * @param {?(ObjectId|String)} data.transaction.accountDestination
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    post(data) {
        const deferred = Q.defer();

        // find the project and make sure that use have permissions to update
        // make sure that project have required entity to update
        this.findSourceAndDestinationAccounts(data)
            .then((accountsToUpdate) => {
                let newTransaction = new TransactionModel({
                    projectId: data.id,
                    type: data.transaction.type,
                    value: data.transaction.value,
                    note: data.transaction.note,
                    category: data.transaction.category,
                    accountSource: data.transaction.accountSource,
                    accountDestination: data.transaction.accountDestination,
                    created: new Date(),
                    createdBy: data.userId,
                    modifiedBy: data.userId
                });

                newTransaction.save((error, transaction) => {
                    if (error) {
                        logger.error('New transaction hasn\'t been created');
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    logger.info('New transaction has been successfully created');
                    deferred.resolve(transaction);
                });
            })
            .catch((error) => {
                logger.error(error);
                deferred.reject(error);
            });

        return deferred.promise;
    },

    /**
     * Update transaction
     *
     * @function
     * @name update
     * @memberof controllers/Transaction
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.transaction
     * @param {(ObjectId|String)} data.transaction.id
     * @param {String} data.transaction.type
     * @param {Number} data.transaction.value
     * @param {String} data.transaction.note
     * @param {?(ObjectId|String)} data.transaction.category
     * @param {?(ObjectId|String)} data.transaction.accountSource
     * @param {?(ObjectId|String)} data.transaction.accountDestination
     *
     * @returns {Promise<models/TransactionSchema|Error>}
     */
    update(data) {
        const deferred = Q.defer();

        // find the project and make sure that use have permissions to update
        // make sure that project have required entity to update
        this.findSourceAndDestinationAccounts(data)
            .then((accountsToUpdate) => {
                TransactionModel.findOneAndUpdate({
                    _id: data.transaction.id
                }, {
                    type: data.transaction.type,
                    value: data.transaction.value,
                    note: data.transaction.note,
                    category: data.transaction.category,
                    accountSource: data.transaction.accountSource,
                    accountDestination: data.transaction.accountDestination,
                    modified: new Date(),
                    modifiedBy: data.userId
                }, {
                    runValidators: true,
                    new: true //return the modified document rather than the original
                })
                    .exec((error, doc) => {
                        if (error) {
                            logger.error('Transaction has not been updated: ' + data.transaction.id);
                            logger.error(error);
                            deferred.reject(error);

                            return;
                        }

                        logger.info('Transaction has been successfully updated: ' + data.transaction.id);
                        deferred.resolve(doc);
                    });
            })
            .catch((error) => {
                logger.error(error);
                deferred.reject(error);
            });

        return deferred.promise;
    },

    /**
     * Get get all transaction by projectId
     *
     * @function
     * @name getAllByProjectId
     * @memberof controllers/Transaction
     * @param {(ObjectId|String)} id - project id
     *
     * @returns {Promise<models/TransactionSchema[]|Error>}
     */
    getAllByProjectId(id) {
        const deferred = Q.defer();

        TransactionModel.find({
            projectId: id
        })
            .exec((error, docs) => {
                if (error) {
                    logger.error('Transactions by project id have not been found: ' + id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Transactions by project id have been successfully found: ' + id);
                deferred.resolve(docs);
            });

        return deferred.promise;
    },

    /**
     * Delete transaction
     *
     * @function
     * @name delete
     * @memberof controllers/Transaction
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId - project id
     * @param {(ObjectId|String)} data.transactionId
     *
     * @returns {Promise<void|Error>}
     */
    delete(data) {
        const deferred = Q.defer();

        // find the project and make sure that use have permissions to update
        // make sure that project have required entity to update
        ProjectModel.findOne({
            _id: data.id,
            owners: data.userId
        })
            .populate('accounts')
            .exec((error, project) => {
                if (error) {
                    logger.error('Project for deleting transaction was not found ' +
                        'or use doesn\'t have permissions to deleting transaction: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                TransactionModel.findByIdAndRemove(data.transactionId)
                    .exec((error, doc) => {
                        if (error) {
                            logger.error('Transaction has not been deleted: ' + data.transactionId);
                            logger.error(error);
                            deferred.reject(error);

                            return;
                        }

                        logger.info('Transaction has been successfully deleted: ' + data.transactionId);
                        deferred.resolve();
                    });
            });

        return deferred.promise;
    },

    /**
     * Populate transaction
     *
     * @function
     * @name populateTransaction
     * @memberof controllers/Transaction
     * @param {models/TransactionSchema} transaction
     *
     * @returns {Promise<models/TransactionSchema|Error>}
     */
    populateTransaction(transaction) {
        let deferred = Q.defer();

        TransactionModel.populate(transaction, 'category accountSource accountDestination',
            (error, populatedTransaction) => {
                if (error) {
                    logger.error('New transaction cannot be populated');
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                deferred.resolve(populatedTransaction);
            });

        return deferred.promise;
    },

    /**
     * Find project and from that project find source and destination accounts
     *
     * @function
     * @name update
     * @memberof controllers/Transaction
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.transaction
     * @param {?(ObjectId|String)} data.transaction.accountSource
     * @param {?(ObjectId|String)} data.transaction.accountDestination
     *
     * @returns {Promise<Object|Error>}
     */
    findSourceAndDestinationAccounts(data) {
        const deferred = Q.defer();

        ProjectModel.findOne({
            _id: data.id,
            owners: data.userId
        })
            .populate('accounts')
            .exec((error, project) => {
                let accountDestinationToUpdate;
                let accountSourceToUpdate;

                if (error) {
                    logger.error('Project for adding/update transaction was not found ' +
                        'or use doesn\'t have permissions to adding/update transaction: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                // Get source and destination accounts from project
                accountSourceToUpdate = project.accounts.find(function (account) {
                    return account._id.toString() === data.transaction.accountSource.toString()
                });

                accountDestinationToUpdate = project.accounts.find(function (account) {
                    return account._id.toString() === data.transaction.accountDestination.toString()
                });

                if (!accountSourceToUpdate || !accountDestinationToUpdate) {
                    error = {
                        name: 'NotFoundError',
                        message: 'Account Source or Account Destination of the project with given id ' +
                        'was not found for updating: ' + data.id
                    };

                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                deferred.resolve({
                    accountSourceToUpdate,
                    accountDestinationToUpdate
                })
            });

        return deferred.promise;
    }
};
