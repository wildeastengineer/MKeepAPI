var accountController = require('../controllers/account.js');

var accountRegisterRoutes = function (router, isAuthorized, sendError) {
        router.route('/accounts')
            .get(isAuthorized, function (req, res) {
                accountController.getAll(
                    function (err, accounts) {
                        if (err) {
                            sendError(err, res);

                            return;
                        }

                        res.json(accounts);
                    }
                );
            })
            .post(isAuthorized, function (req, res) {
                accountController.post(
                    {
                        name: req.body.name,
                        initValue: req.body.initValue,
                        currency: req.body.currency
                    },
                    function (err, currency) {
                        if (err) {
                            sendError(err, res);

                            return;
                        }

                        res.json(currency);
                    }
                );
            });

        router.route('/accounts/:accounts_id/recalculate')
            .get(isAuthorized, function (req, res) {
                accountController.recalculate(
                    req.params.accounts_id,
                    function (err, account) {
                        if (err) {
                            sendError(err, res);

                            return;
                        }

                        res.json(account);
                    }
                );
            });

        router.route('/accounts/:accounts_id')
            .get(isAuthorized, function (req, res) {
                accountController.getById(
                    req.params.accounts_id,
                    function (err, account) {
                        if (err) {
                            sendError(err, res);

                            return;
                        }

                        res.json(account);
                    }
                );
            })
            .put(isAuthorized, function (req, res) {
                accountController.update(
                    req.params.accounts_id,
                    {
                        name: req.body.name,
                        initValue: req.body.initValue,
                        currency: req.body.currency
                    },
                    function (err, account) {
                        if (err) {
                            sendError(err, res);

                            return;
                        }

                        res.json(account);
                    }
                );
            })
            .delete(isAuthorized, function (req, res) {
                accountController.remove(
                    req.params.accounts_id,
                    function (err, account) {
                        if (err) {
                            sendError(err, res);

                            return;
                        }

                        res.json(account);
                    }
                );
            });
};

module.exports = {
    register: accountRegisterRoutes
};
