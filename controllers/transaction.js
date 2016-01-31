var Transaction = require('../models/transaction');
var Account = require('../models/account');
var Category = require('../models/category');
var transactionRoutes = require('./transaction_routes');

// ToDo: remove this when auth is implemented
var user = {
    _id: 777
};

var transactionController = {
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
        var transaction = new Transaction();

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

                var oldType = transaction.type;
                var oldValue = transaction.value;

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
        var that = this;

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
                                            message: 'Destination account with id=' + transaction.accountDestination + ' was not found.'
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
    },
    registerRoutes: function (router, isAuthorized, sendError) {
        transactionRoutes(router, this, isAuthorized, sendError);
    }
};

module.exports = transactionController;
