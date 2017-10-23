/// Controllers
const accountController = require('../controllers/account.js');

/**
 * Account routes.
 * @class routes/Account
 */
let AccountRegisterRoutes = function (router, authenticate) {
    /**
     * Create new account. And add account to give project
     *
     * @function
     * @name POST: /accounts
     * @memberof routes/Account
     *
     * @param {Object} account
     * @param {String} account.name
     * @param {Number} account.value
     * @param {Number} account.initValue
     * @param {?(ObjectId|String)[]} account.projects
     * @param {(ObjectId|String)} account.currency
     * @param {(ObjectId|String)} userId
     *
     * @returns {models/ProjectSchema} project - Created account.
     */
    router.post('/accounts', authenticate, (req, res, next) => {
        accountController.post({
            account: request.body.account,
            userId: req.user._id
        })
            .then((account) => {
                return accountController.addAccountToProjects(account);
            })
            .then((account) => {
                res.json(account);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Get list of all projects.
     *
     * @function
     * @name GET: /accounts
     * @memberof routes/Accounts
     *
     * @returns {models/AccountSchema[]} accounts - All available accounts.
     */
    router.get('/accounts', authenticate, (req, res, next) => {
        accountController.getAll({
            userId: req.user._id
        })
            .then((accounts) => {
                res.json(accounts);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Get account by id
     *
     * @function
     * @name GET: /accounts/:id
     * @memberof routes/Account
     *
     * @returns {models/AccountSchema} account
     */
    router.get('/accounts/:id', authenticate, (req, res, next) => {
        accountController.getById({
            id: req.params.id,
            userId: req.user._id
        })
            .then((account) => {
                res.json(account);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Update account by id
     *
     * @function
     * @name PATCH: /accounts/:id
     * @memberof routes/Account
     *
     * @returns {models/AccountSchema} account
     */
    router.patch('/accounts/:id', authenticate, (req, res, next) => {
        accountController.update({
            account: req.body.account,
            userId: req.user._id
        })
            .then((account) => {
                res.json(account);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Delete account by account id. Delete account from all project listed in account.projects
     *
     * @function
     * @name DELETE: /accounts/:id
     * @memberof routes/Account
     *
     * @returns {models/AccountSchema} account
     */
    router.delete('/accounts/:id', authenticate, (req, res, next) => {
        accountController.delete({
            id: req.params.id,
            userId: req.user._id
        })
            .then(() => {
                return accountController.deleteAccountFromProjects(account);
            })
            .then((account) => {
                res.json(account);
            })
            .fail((error) => {
                next(error);
            });
    });
};

module.exports = {
    register: AccountRegisterRoutes
};
