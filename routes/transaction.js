/// Controllers
var transactionController = require('../controllers/transaction.js');

var transactionRegisterRoutes = function (router, authenticate, sendError) {
    router.route('/transactions')
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
