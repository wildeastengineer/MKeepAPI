/// Controllers
var projectController = require('../controllers/project.js');

var ProjectRegisterRoutes = function (router, authenticate) {
    router.post('/projects', authenticate, function (req, res, next) {
        projectController.post({
            name: req.body.name,
            userId: req.user._id,
            mainCurrency: req.body.mainCurrency
        })
            .then(function (project) {
                res.json(project);
            })
            .fail(function (error) {
                next(error);
            });
    });

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

    router.post('/projects/:id/currencies/main', authenticate, function (req, res, next) {
        projectController.updateMainCurrency({
            id: req.params.id,
            userId: req.user._id,
            mainCurrency: req.body.mainCurrency
        })
            .then(function (currencies) {
                res.json(currencies);
            })
            .fail(function (error) {
                next(error);
            });
    });

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
