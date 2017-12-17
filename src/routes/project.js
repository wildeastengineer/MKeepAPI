/// Libs
const _ = require('underscore');
/// Controllers
const projectController = require('../controllers/project.js');

/**
 * Projects routes.
 * @class routes/Project
 */
let ProjectRegisterRoutes = function (router, authenticate) {
    /**
     * Create new project.
     *
     * @function
     * @name POST: /projects
     * @memberof routes/Project
     *
     * @param {String} name - Project's name
     * @param {String} mainCurrency - Project's main currency id
     *
     * @returns {models/ProjectSchema} project - Created project.
     */
    router.post('/projects', authenticate, (req, res, next) => {
        projectController.post({
            name: req.body.name,
            mainCurrency: req.body.mainCurrency,
            userId: req.user._id
        })
            .then((project) => {
                res.json(project);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Create transaction.
     *
     * @function
     * @name POST: /projects/:id/transactions
     * @memberof routes/Project
     *
     * @param {String} id - Project id
     * @param {String} userId
     * @param {Object} body
     * @param {String} body.type
     * @param {Number} body.value
     * @param {String} body.note
     * @param {String} body.category
     * @param {String} body.accountSource
     * @param {String} body.accountDestination
     *
     * @returns {models/TransactionSchema} transaction - Created transaction.
     */
    router.post('/projects/:id/transactions', authenticate, (req, res, next) => {
        const transactionParams = _.pick(req.body, 'type', 'value',
            'note', 'category', 'accountSource', 'accountDestination');

        projectController.addTransaction({
            id: req.params.id,
            userId: req.user._id,
            transaction: transactionParams
        })
            .then((project) => {
                res.json(project);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Get list of all projects.
     *
     * @function
     * @name GET: /projects
     * @memberof routes/Project
     *
     * @returns {models/ProjectSchema[]} projects - All available projects.
     */
    router.get('/projects', authenticate, (req, res, next) => {
        projectController.getAll({
            userId: req.user._id
        })
            .then((projects) => {
                res.json(projects);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Get project by id and setup active project for given user
     *
     * @function
     * @name GET: /projects/:id
     * @memberof routes/Project
     *
     * @returns {models/ProjectSchema} project
     */
    router.get('/projects/:id', authenticate, (req, res, next) => {
        projectController.getById({
            id: req.params.id,
            userId: req.user._id
        })
            .then((project) => {
                res.json(project);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Update project's name
     *
     * @function
     * @name PATCH: /projects/:id/rename
     * @memberof routes/Project
     *
     * @param {String} name - Project's new name
     *
     * @returns {String} name - New project's name.
     */
    router.patch('/projects/:id/rename', authenticate, (req, res, next) => {
        projectController.rename({
            id: req.params.id,
            userId: req.user._id,
            name: req.body.name
        })
            .then((name) => {
                res.json(name);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Get project categories by project id.
     *
     * @function
     * @name GET: /projects/:id/categories
     * @memberof routes/Project
     *
     * @returns {models/CategorySchema[]} categories
     */
    router.get('/projects/:id/categories', authenticate, (req, res, next) => {
        projectController.getCategories({
            id: req.params.id,
            userId: req.user._id
        })
            .then((categories) => {
                res.json(categories);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Add new category to project's category
     *
     * @function
     * @name PUT: /projects/:id/categories
     * @memberof routes/Project
     *
     * @returns {models/CategorySchema} category - New add category to given project
     */
    router.put('/projects/:id/categories', authenticate, (req, res, next) => {
        const categoryParams = _.pick(req.body, 'name', 'type', 'parent');

        projectController.addCategory({
            id: req.params.id,
            userId: req.user._id,
            category: categoryParams
        })
            .then((category) => {
                res.json(category);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Update given project categories
     *
     * @function
     * @name PATCH: /projects/:id/categories/:categoryId
     * @memberof routes/Project
     *
     * @returns {models/CategorySchema} category - new category
     */
    router.patch('/projects/:id/categories/:categoryId', authenticate, (req, res, next) => {
        const categoryParams = _.pick(req.body, 'name', 'type', 'parent');

        projectController.updateCategory({
            id: req.params.id,
            userId: req.user._id,
            category: {
                id: req.params.categoryId,
                ...categoryParams
            }
        })
            .then((category) => {
                res.json(category);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Delete given project category
     *
     * @function
     * @name DELETE: /projects/:id/categories/:categoryId
     * @memberof routes/Project
     *
     * @returns {void}
     */
    router.delete('/projects/:id/categories/:categoryId', authenticate, (req, res, next) => {
        projectController.deleteCategory({
            id: req.params.id,
            userId: req.user._id,
            categoryId: req.params.categoryId
        })
            .then(() => {
                res.json();
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Update project's currencies list
     *
     * @function
     * @name PATCH: /projects/:id/currencies
     * @memberof routes/Project
     *
     * @param {String[]} currencies - Array of currencies id
     *
     * @returns {models/CurrencySchema[]} currencies - New project's currencies list.
     */
    router.patch('/projects/:id/currencies', authenticate, (req, res, next) => {
        projectController.updateCurrencies({
            id: req.params.id,
            userId: req.user._id,
            currencies: req.body.currencies
        })
            .then((currencies) => {
                res.json(currencies);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Update project's main currency
     *
     * @function
     * @name PATCH: /projects/:id/currencies/main
     * @memberof routes/Project
     *
     * @param {String} mainCurrency - New main currency id
     *
     * @returns {models/CurrencySchema} currency - New project's main currency.
     */
    router.patch('/projects/:id/currencies/main', authenticate, (req, res, next) => {
        projectController.updateMainCurrency({
            id: req.params.id,
            userId: req.user._id,
            mainCurrency: req.body.mainCurrency
        })
            .then((currency) => {
                res.json(currency);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Get project accounts by project id.
     *
     * @function
     * @name GET: /projects/:id/accounts
     * @memberof routes/Project
     *
     * @returns {models/AccountSchema[]} accounts
     */
    router.get('/projects/:id/accounts', authenticate, (req, res, next) => {
        projectController.getAccounts({
            id: req.params.id,
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
     * Add new account to project's accounts
     *
     * @function
     * @name PUT: /projects/:id/accounts
     * @memberof routes/Project
     *
     * @returns {models/AccountSchema} account - New add account to given project
     */
    router.put('/projects/:id/accounts', authenticate, (req, res, next) => {
        const accountParams = _.pick(req.body, 'name', 'initValue', 'value', 'currency');

        projectController.addAccount({
            id: req.params.id,
            userId: req.user._id,
            account: accountParams
        })
            .then((account) => {
                res.json(account);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Update given project account
     *
     * @function
     * @name PATCH: /projects/:id/categories/:accountId
     * @memberof routes/Project
     *
     * @returns {models/AccountSchema} - updated account
     */
    router.patch('/projects/:id/accounts/:accountId', authenticate, (req, res, next) => {
        const accountParams = _.pick(req.body, 'name', 'initValue', 'value', 'currency');

        projectController.updateAccount({
            id: req.params.id,
            userId: req.user._id,
            account: {
                id: req.params.accountId,
                ...accountParams
            }
        })
            .then((account) => {
                res.json(account);
            })
            .fail((error) => {
                next(error);
            });
    });

    /**
     * Delete given project account
     *
     * @function
     * @name DELETE: /projects/:id/accounts/:accountId
     * @memberof routes/Project
     *
     * @returns {void}
     */
    router.delete('/projects/:id/accounts/:accountId', authenticate, (req, res, next) => {
        projectController.deleteAccount({
            id: req.params.id,
            userId: req.user._id,
            accountId: req.params.accountId
        })
            .then(() => {
                res.json();
            })
            .fail((error) => {
                next(error);
            });
    });
};

module.exports = {
    register: ProjectRegisterRoutes
};
