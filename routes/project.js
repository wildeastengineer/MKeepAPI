/// Libs
var config = require('../libs/config');
/// Controllers
var projectController = require('../controllers/project.js');

var ProjectRegisterRoutes = function (router, authenticate, sendError) {
    router.post('/projects', authenticate, function (req, res) {
        projectController.post({
            name: req.body.name,
            userId: req.user._id
        })
            .then(function (project) {
                res.json(project);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    router.get('/projects', authenticate, function (req, res) {
        projectController.getAll({
            userId: req.user._id
        })
            .then(function (projects) {
                res.json(projects);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    router.get('/projects/:id', authenticate, function (req, res) {
        projectController.getById({
            id: req.params.id,
            userId: req.user._id
        })
            .then(function (project) {
                res.json(project);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    router.post('/projects/:id/update-currencies', authenticate, function (req, res) {
        projectController.updateCurrencies({
            id: req.params.id,
            userId: req.user._id,
            currencies: req.body.currencies
        })
            .then(function (currencies) {
                res.json(currencies);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });


    router.post('/projects/:id/rename', authenticate, function (req, res) {
        projectController.rename({
            id: req.params.id,
            userId: req.user._id,
            name: req.body.name
        })
            .then(function (name) {
                res.json(name);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });
};

module.exports = {
    register: ProjectRegisterRoutes
};
