/// Libs
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const UserModel = require('../models/auth/user');
const ProjectModel = require('../models/project');
/// Controllers
const CurrencyController = require('./currency');
/// Local variables
let logger = Logger(module);
/// Private functions

/**
 * Projects controller.
 * @class controllers/Project
 */
let projectController = {
    /**
     * Create new project
     *
     * @function
     * @name post
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {String} data.name
     * @param {(ObjectId|String)} data.userId
     * @param {Object[]} [data.accounts]
     * @param {(ObjectId[]|String[])} [data.currencies]
     * @param {(ObjectId|String)} [data.mainCurrency]
     * @param {Object[]} [data.categories]
     * @param {Object[]} [data.widgets]
     *
     * @returns {Promise<models/ProjectSchema|Error>}
     */
    post: function (data) {
        let deferred = Q.defer();
        let newProject;

        newProject = new ProjectModel({
            name: data.name,
            owners: [data.userId],
            users: [data.userId],
            mainCurrency: data.mainCurrency,
            created: new Date(),
            createdBy: data.userId,
            modifiedBy: data.userId
        });

        newProject.save(function (error, project) {
            if (error) {
                logger.error('New project hasn\'t been created');
                logger.error(error);
                deferred.reject(error);

                return;
            }

            // Find User and add project id to projects field
            UserModel.findOneAndUpdate({
                _id: data.userId
            }, {
                $addToSet: {
                    projects: project._id
                }
            }, {
                runValidators: true
            })
                .exec(function (error, doc) {
                    if (error) {
                        logger.error(error);
                        logger.error('Project with given id wasn\'t added to user: ' + data.userId);
                        deferred.reject(error);

                        return;
                    }

                    ProjectModel.populate(project, 'owners users currencies mainCurrency createdBy modifiedBy',
                        function (error, project) {
                            if (error) {
                                logger.error('New project cannot be populated');
                                logger.error(error);
                                deferred.reject(error);

                                return;
                            }

                            logger.info('New project has been successfully created: ' + project._id);
                            deferred.resolve(project);
                        });
                });
        });

        return deferred.promise;
    },

    /**
     * Get project by id
     *
     * @function
     * @name getById
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/ProjectSchema|Error>}
     */
    getById: function (data) {
        let deferred = Q.defer();

            ProjectModel.findOne({
                users: data.userId,
                _id: data.id
            })
                .populate('owners users currencies mainCurrency createdBy modifiedBy')
                .exec(function (error, project) {
                    if (error) {
                        logger.error('Project with given id wasn\'t found: ' + data.id);
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    logger.info('Project with given id was successfully found: ' + data.id);
                    deferred.resolve(project);
                });

        return deferred.promise;
    },

    /**
     * Get list of all projects
     *
     * @function
     * @name getAll
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/ProjectSchema[]|Error>}
     */
    getAll: function (data) {
        let deferred = Q.defer();

        ProjectModel.find({
            users: data.userId
        })
            .populate('owners users currencies mainCurrency createdBy modifiedBy')
            .exec(function (error, projects) {
                if (error) {
                    logger.error('Projects with given user weren\'t found: ' + data.userId);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Projects with given user were successfully found: ' + data.userId);
                deferred.resolve(projects);
            });

        return deferred.promise;
    },

    /**
     * Update currencies array in given project
     *
     * @function
     * @name updateCurrencies
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId[]|String[])} data.currencies
     *
     * @returns {Promise<models/CurrencySchema[]|Error>}
     */
    updateCurrencies: function (data) {
        const that = this;
        let deferred = Q.defer();

        CurrencyController.updateProjectCurrencies(data)
            .then(function () {
                that.getById(data)
                    .then(function (project) {
                        deferred.resolve(project.currencies);
                    })
                    .fail(function (error) {
                        deferred.reject(error);
                    });
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    },

    /**
     * Update main project currency
     *
     * @function
     * @name updateMainCurrency
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - Project id
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.mainCurrency
     *
     * @returns {Promise<models/CurrencySchema|Error>}
     */
    updateMainCurrency: function (data) {
        return CurrencyController.updateProjectMainCurrency(data);
    },

    /**
     * Rename project with given name
     *
     * @function
     * @name updateMainCurrency
     * @memberof controllers/Project
     *
     * @param {Object} rename
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     * @param {String} data.name
     *
     * @returns {Promise<String|Error>} - New project name
     */
    rename: function (data) {
        let deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            name: data.name
        }, {
            runValidators: true
        })
            .exec(function (error, doc) {
                if (error) {
                    logger.error(error);
                    logger.error('Project was not renamed: ' + data.id);
                    deferred.reject(error);

                    return;
                }

                logger.info('Project was successfully renamed: ' + data.id);
                deferred.resolve(doc.name);
            });

        return deferred.promise;
    }
};

module.exports = projectController;
