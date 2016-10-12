/// Controllers
var projectController = require('../controllers/project.js');

/**
 * Projects routes.
 * @class routes/Project
 */
var ProjectRegisterRoutes = function (router, authenticate) {
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
    router.post('/projects', authenticate, function (req, res, next) {
        projectController.post({
            name: req.body.name,
            mainCurrency: req.body.mainCurrency,
            userId: req.user._id
        })
            .then(function (project) {
                res.json(project);
            })
            .fail(function (error) {
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
    router.get('/projects', authenticate, function (req, res, next) {
        projectController.getAll({
            userId: req.user._id
        })
            .then(function (projects) {
                res.json(projects);
            })
            .fail(function (error) {
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
    router.get('/projects/:id', authenticate, function (req, res, next) {
        projectController.getById({
            id: req.params.id,
            userId: req.user._id
        })
            .then(function (project) {
                res.json(project);
            })
            .fail(function (error) {
                next(error);
            });
    });

    /**
     * Update project's currencies list
     *
     * @function
     * @name POST: /projects/:id/currencies/update
     * @memberof routes/Project
     *
     * @param {String[]} currencies - Array of currencies id
     *
     * @returns {models/CurrencySchema[]} currencies - New project's currencies list.
     */
    router.post('/projects/:id/currencies/update', authenticate, function (req, res, next) {
        projectController.updateCurrencies({
            id: req.params.id,
            userId: req.user._id,
            currencies: req.body.currencies
        })
            .then(function (currencies) {
                res.json(currencies);
            })
            .fail(function (error) {
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
    router.post('/projects/:id/currencies/main', authenticate, function (req, res, next) {
        projectController.updateMainCurrency({
            id: req.params.id,
            userId: req.user._id,
            mainCurrency: req.body.mainCurrency
        })
            .then(function (currency) {
                res.json(currency);
            })
            .fail(function (error) {
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
    router.post('/projects/:id/rename', authenticate, function (req, res, next) {
        projectController.rename({
            id: req.params.id,
            userId: req.user._id,
            name: req.body.name
        })
            .then(function (name) {
                res.json(name);
            })
            .fail(function (error) {
                next(error);
            });
    });
};

module.exports = {
    register: ProjectRegisterRoutes
};
