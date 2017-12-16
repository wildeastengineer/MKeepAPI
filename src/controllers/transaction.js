/// Libs
const Logger = require('../libs/log');
const Q = require('q');
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
     * @name post
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
        //find project to figure out whether use is able to create transactions

        //created transaction specifying account sources
        // IF transaction type income or expense
        //update accounts values base on value =+ transaction.value * (-1 or +1 depends on type)
        // IF ELSE transaction type is transfer
        //update accountSource.value = value - transaction.value
        //update accountDestination.value = value + transaction.value
        //return
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
     * @param {String} data.transaction.type
     * @param {Number} data.transaction.value
     * @param {String} data.transaction.note
     * @param {?(ObjectId|String)} data.transaction.category
     * @param {?(ObjectId|String)} data.transaction.accountSource
     * @param {?(ObjectId|String)} data.transaction.accountDestination
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    update(data) {

    },

    /**
     * Get get all transaction by projectId
     *
     * @function
     * @name getAllByProjectId
     * @memberof controllers/Transaction
     * @param {(ObjectId|String)} data.id - project id
     *
     * @returns {Promise<models/CategorySchema[]|Error>}
     */
    getAllByProjectId(data) {

    },

    /**
     * Delete transaction
     *
     * @function
     * @name delete
     * @memberof controllers/Transaction
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.transactionId
     *
     * @returns {Promise<void|Error>}
     */
    delete(data) {

    }
};





let transactionController = {
    getAll: function (pagination, callback) {
        pagination = pagination || {};
        pagination.page = pagination.page || 1;
        pagination.perPage = pagination.perPage || 10;

        Transaction.paginate(
            {
                _owner: user._id
            },
            pagination.page,
            pagination.perPage,
            function (error, pageCount, paginatedResults, totalItems) {
                console.log('pagination result');
                console.log('page: ', pagination.page);
                console.log('perPage: ', pagination.perPage);
                console.log('pageCount: ', pageCount);
                console.log('totalItems: ', totalItems);

                callback(error, paginatedResults, totalItems);
            },
            {
                populate: ['category', 'accountSource', 'accountDestination']
                //sortBy: {title: -1}
            }
        );
    },
    getById: function (id, callback) {
        Transaction.findOne({
            _id: id,
            _owner: user._id
        })
            .populate('category')
            .populate('accountSource')
            .populate('accountDestination')
            .exec(callback);
    },
    post: function (data, callback) {
        let transaction = new Transaction();

        transaction._owner = user._id;
        transaction.date = data.date;
        transaction.category = data.category;
        transaction.value = data.value;
        transaction.type = data.type;
        transaction.accountSource = data.accountSource;
        transaction.accountDestination = data.accountDestination;
        transaction.note = data.note;

        console.log('Getting account ' + transaction.accountSource);
        Account.findOne({
            _id: transaction.accountSource,
            _owner: user._id
        })
            .exec(function (err, accountSource) {
                if (!accountSource || err) {
                    err = err || {
                        status: 404,
                        message: 'Source account with id=' + transaction.accountSource + ' was not found.'
                    };

                    console.error(err);
                    callback(err);
                    return;
                }

                if (transaction.type !== 'transfer') {
                    accountSource.value += transaction.value * (transaction.type === 'income' ? 1 : -1);

                    accountSource.save(function (err) {
                        if (err) {
                            console.error(err);
                            callback(err);
                        }
                        transaction.save(callback);
                    });
                } else {
                    Account.findOne({
                        _id: transaction.accountDestination,
                        _owner: user._id
                    })
                        .exec(function (err, accountDestination) {
                            if (!accountDestination || err) {
                                err = err || {
                                    status: 404,
                                    message: 'Destination account with id=' + transaction.accountDestination + ' was not found.'
                                };

                                console.error(err);
                                callback(err);
                                return;
                            }

                            accountSource.value -= transaction.value;
                            accountDestination.value += transaction.value;

                            accountSource.save(function (err) {
                                if (err) {
                                    console.error(err);
                                    callback(err);
                                }
                                accountDestination.save(function (err) {
                                    if (err) {
                                        console.error(err);
                                        callback(err);
                                    }
                                    transaction.save(callback);
                                });
                            });
                        });
                }
            });
    },
    update: function (id, data, callback) {
        Transaction.findOne(
            {
                _id: id,
                _owner: user._id
            },
            function (err, transaction) {
                if (err) {
                    callback(err);

                    return;
                }

                let oldType = transaction.type;
                let oldValue = transaction.value;

                transaction.date = data.date;
                transaction.category = data.category;
                transaction.value = data.value;
                transaction.type = data.type;
                transaction.accountSource = data.accountSource;
                transaction.accountDestination = data.accountDestination;
                transaction.note = data.note;

                console.log('Getting account ' + transaction.accountSource);
                Account.findOne({
                    _id: transaction.accountSource,
                    _owner: user._id
                })
                    .exec(function (err, accountSource) {
                        if (!accountSource || err) {
                            err = err || {
                                status: 404,
                                message: 'Source account with id=' + transaction.accountSource + ' was not found.'
                            };

                            console.error(err);
                            callback(err);
                            return;
                        }

                        if (transaction.type !== 'transfer') {

                            accountSource.value -= oldValue * (oldType === 'income' ? 1 : -1);
                            accountSource.value += transaction.value * (transaction.type === 'income' ? 1 : -1);

                            accountSource.save(function (err) {
                                if (err) {
                                    console.error(err);
                                    callback(err);
                                }
                                transaction.save(callback);
                            });
                        } else {
                            Account.findOne({
                                _id: transaction.accountDestination,
                                _owner: user._id
                            })
                                .exec(function (err, accountDestination) {
                                    if (!accountDestination || err) {
                                        err = err || {
                                            status: 404,
                                            message: 'Destination account with id=' + transaction.accountDestination + ' was not found.'
                                        };

                                        console.error(err);
                                        callback(err);
                                        return;
                                    }

                                    accountSource.value -= oldValue * (oldType === 'income' ? 1 : -1);
                                    accountSource.value += transaction.value * (transaction.type === 'income' ? 1 : -1);

                                    accountDestination.value += oldValue * (oldType === 'income' ? 1 : -1);
                                    accountDestination.value -= transaction.value * (transaction.type === 'income' ? 1 : -1);

                                    accountSource.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            callback(err);
                                        }
                                        accountDestination.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                callback(err);
                                            }
                                            transaction.save(callback);
                                        });
                                    });
                                });
                        }
                    });

                // transaction.save(callback);
            }
        );
    },
    remove: function (id, callback) {
        let that = this;

        Transaction.findOne(
            {
                _id: id,
                _owner: user._id
            },
            function (err, transaction) {
                if (!transaction || err) {
                    err = err || {
                        status: 404,
                        message: 'Transaction with id=' + id + ' was not found.'
                    };
                    console.error(err);
                    callback(err);

                    return;
                }

                Account.findOne(
                    {
                        _id: transaction.accountSource,
                        _owner: user._id
                    },
                    function (err, accountSource) {
                        if (!accountSource || err) {
                            err = err || {
                                status: 404,
                                message: 'Source account with id=' + transaction.accountSource + ' was not found.'
                            };
                            console.error(err);
                            callback(err);

                            return;
                        }

                        if (transaction.type !== 'transfer') {
                            accountSource.value -= transaction.value * (transaction.type === 'income' ? 1 : -1);

                            accountSource.save(function (err) {
                                if (err) {
                                    console.error(err);
                                    callback(err);
                                }
                                Transaction.remove(
                                    {
                                        _id: id,
                                        _owner: user._id
                                    },
                                    function (err) {
                                        if (err) {
                                            callback(err);
                                            return;
                                        }

                                        Transaction.find(
                                            {
                                                _owner: user._id
                                            })
                                            .populate('category')
                                            .populate('accountSource')
                                            .populate('accountDestination')
                                            .exec(callback);
                                    }
                                );
                            });
                        } else {
                            Account.findOne(
                                {
                                    _id: transaction.accountDestination,
                                    _owner: user._id
                                },
                                function (err, accountDestination) {
                                    if (!accountDestination || err) {
                                        err = err || {
                                            status: 404,
                                            message: 'Destination account with id=' +
                                                    transaction.accountDestination + ' was not found.'
                                        };
                                        console.error(err);
                                        callback(err);

                                        return;
                                    }

                                    accountSource.value += transaction.value;
                                    accountDestination.value -= transaction.value;

                                    accountSource.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            callback(err);
                                        }
                                        accountDestination.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                callback(err);
                                            }
                                            Transaction.remove(
                                                {
                                                    _id: id,
                                                    _owner: user._id
                                                },
                                                function (err) {
                                                    if (err) {
                                                        callback(err);
                                                        return;
                                                    }

                                                    Transaction.find(
                                                        {
                                                            _owner: user._id
                                                        })
                                                        .populate('category')
                                                        .populate('accountSource')
                                                        .populate('accountDestination')
                                                        .exec(callback);
                                                }
                                            );
                                        });
                                    });
                                }
                            );
                        }
                    }
                );
            }
        );
    }
};
