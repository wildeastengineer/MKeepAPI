/// Controllers
var transactionController = require('../controllers/transaction.js');

/**
 * Transactions routes.
 * @class routes/Transaction
 */
var transactionRegisterRoutes = function (router, authenticate, sendError) {
    router.route('/transactions')
        /**
         * Get list of transactions.
         *
         * @function
         * @name GET: /transactions
         * @memberof routes/Transaction
         *
         * @param {Number} page
         * @param {Number} perPage
         *
         * @returns {models/TransactionSchema[]} transactions
         */
        .get(authenticate, function (req, res) {
            transactionController.getAll(
                {
                    page: req.query.page,
                    perPage: req.query.perPage
                },
                function (err, transactions, totalItems) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.setHeader('X-Total-Count', totalItems);
                    res.json(transactions);
                }
            );
        })

        /**
         * Create new transaction.
         *
         * @function
         * @name POST: /transactions
         * @memberof routes/Transaction
         *
         * @param {Date} date
         * @param {String} category
         * @param {Number} value
         * @param {String} type - 'income' | 'expense'
         * @param {String} accountSource
         * @param {String} accountDestination
         * @param {String} note
         *
         * @returns {models/TransactionSchema} transaction
         */
        .post(authenticate, function (req, res) {
            transactionController.post(
                {
                    date: req.body.date,
                    category: req.body.category,
                    value: req.body.value,
                    type: req.body.type,
                    accountSource: req.body.accountSource,
                    accountDestination: req.body.accountDestination,
                    note: req.body.note
                },
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        });

    router.route('/transactions/:transaction_id')
        /**
         * Get transaction by id.
         *
         * @function
         * @name GET: /transactions/:transaction_id
         * @memberof routes/Transaction
         *
         * @returns {models/TransactionSchema} transaction
         */
        .get(authenticate, function (req, res) {
            transactionController.getById(
                req.params.transaction_id,
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        })

        /**
         * Update transaction by id.
         *
         * @function
         * @name PUT: /transactions/:transaction_id
         * @memberof routes/Transaction
         *
         * @param {Date} date
         * @param {String} category
         * @param {Number} value
         * @param {String} type - 'income' | 'expense'
         * @param {String} accountSource
         * @param {String} accountDestination
         * @param {String} note
         *
         * @returns {models/TransactionSchema} transaction
         */
        .put(authenticate, function (req, res) {
            transactionController.update(
                req.params.transaction_id,
                {
                    date: req.body.date,
                    category: req.body.category,
                    value: req.body.value,
                    type: req.body.type,
                    accountSource: req.body.accountSource,
                    accountDestination: req.body.accountDestination,
                    note: req.body.note
                },
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        })

        /**
         * Remove transaction by id.
         *
         * @function
         * @name DELETE: /transactions/:transaction_id
         * @memberof routes/Transaction
         *
         * @returns {models/TransactionSchema} transaction
         */
        .delete(authenticate, function (req, res) {
            transactionController.remove(
                req.params.transaction_id,
                function (err, transaction) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(transaction);
                }
            );
        });
};

module.exports = {
    register: transactionRegisterRoutes
};
