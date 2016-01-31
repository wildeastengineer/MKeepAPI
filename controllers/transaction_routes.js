module.exports = function (router, TransactionController, isAuthorized, sendError) {
    router.route('/transactions')
        .get(isAuthorized, function (req, res) {
            TransactionController.getAll(
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
        .post(isAuthorized, function (req, res) {
            TransactionController.post(
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
        .get(isAuthorized, function (req, res) {
            TransactionController.getById(
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
        .put(isAuthorized, function (req, res) {
            TransactionController.update(
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
        .delete(isAuthorized, function (req, res) {
            TransactionController.remove(
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
