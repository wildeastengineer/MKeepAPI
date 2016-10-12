/// Controllers
var accountController = require('../controllers/account.js');

/**
 * Accounts routes.
 * @class routes/Account
 */
var accountRegisterRoutes = function (router, authenticate, sendError) {
    router.route('/accounts')
        /**
         * Get all accounts
         *
         * @function
         * @name GET: /accounts
         * @memberof routes/Account
         *
         * @returns {models/AccountSchema[]} accounts
         */
        .get(authenticate, function (req, res) {
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
        /**
         * Create accounts
         *
         * @function
         * @name POST: /accounts
         * @memberof routes/Account
         *
         * @param {String} name - Account name.
         * @param {Number} initValue - Initial account value.
         * @param {String} currency - Currency id.
         *
         * @returns {models/AccountSchema} account
         */
        .post(authenticate, function (req, res) {
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
        /**
         * Recalculate account value
         *
         * @function
         * @name GET: /accounts/:accounts_id/recalculate
         * @memberof routes/Account
         *
         * @returns {models/AccountSchema} account
         */
        .get(authenticate, function (req, res) {
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
        /**
         * Get account by id
         *
         * @function
         * @name GET: /accounts/:accounts_id
         * @memberof routes/Account
         *
         * @returns {models/AccountSchema} account
         */
        .get(authenticate, function (req, res) {
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

        /**
         * Update account by id
         *
         * @function
         * @name PUT: /accounts/:accounts_id
         * @memberof routes/Account
         *
         * @param {String} name
         * @param {number} initValue
         * @param {String} currency - Currency id
         *
         * @returns {models/AccountSchema} account
         */
        .put(authenticate, function (req, res) {
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

        /**
         * Remove account by id
         *
         * @function
         * @name DELETE: /accounts/:accounts_id
         * @memberof routes/Account
         *
         * @returns {models/AccountSchema} account
         */
        .delete(authenticate, function (req, res) {
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
