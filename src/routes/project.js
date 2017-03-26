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
     * Get project by id.
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
     * Update given project categories
     *
     * @function
     * @name PATCH: /projects/:id/categories/:categoryId
     * @memberof routes/Project
     *
     * @returns {models/CategorySchema} category - new category
     */
    router.patch('/projects/:id/categories/:categoryId', authenticate, (req, res, next) => {
        projectController.updateCategory({
            id: req.params.id,
            userId: req.user._id,
            category: {
                id: req.params.categoryId,
                name: req.body.category.name,
                categoryType: req.body.category.categoryType,
                parent: req.body.category.parent
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
     * Add new category to project's category
     *
     * @function
     * @name PUT: /projects/:id/categories
     * @memberof routes/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - Project's id
     * @param {Object} data.category
     * @param {String} data.category.name
     * @param {String} data.category.categoryType
     * @param {?(ObjectId|String)} data.category.parent
     * @param {(ObjectId[]|String[])} data.currencies
     *
     * @returns {models/CategorySchema} category - New add category to given project
     */
    router.put('/projects/:id/categories', authenticate, (req, res, next) => {
        projectController.addCategory({
            id: req.params.id,
            userId: req.user._id,
            category: req.body.category
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
     * @name POST: /projects/:id/currencies
     * @memberof routes/Project
     *
     * @param {String[]} currencies - Array of currencies id
     *
     * @returns {models/CurrencySchema[]} currencies - New project's currencies list.
     */
    router.post('/projects/:id/currencies', authenticate, (req, res, next) => {
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
     * @name POST: /projects/:id/currencies/main
     * @memberof routes/Project
     *
     * @param {String} mainCurrency - New main currency id
     *
     * @returns {models/CurrencySchema} currency - New project's main currency.
     */
    router.post('/projects/:id/currencies/main', authenticate, (req, res, next) => {
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
     * Update project's name
     *
     * @function
     * @name POST: /projects/:id/rename
     * @memberof routes/Project
     *
     * @param {String} name - Project's new name
     *
     * @returns {String} name - New project's name.
     */
    router.post('/projects/:id/rename', authenticate, (req, res, next) => {
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
};

module.exports = {
    register: ProjectRegisterRoutes
};
