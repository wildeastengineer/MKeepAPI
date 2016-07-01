/// Libs
var Logger = require('../libs/log');
var Q = require('q');
var validation = require('../utils/validation');
/// Models
var AccessTokenModel = require('../models/auth/accessToken');
var CurrencyModel = require('../models/currency');
var ProjectModel = require('../models/project');
/// Controllers
var userController = require('./user');
/// Local variables
var logger = Logger(module);
/// Private functions
var getUserIdFromAccessToken;

/**
 * @params {string} accessToken
 *
 * @returns {promise}
 */
getUserIdFromAccessToken = function (accessToken) {
    var deferred = Q.defer();

    AccessTokenModel.findOne({
        token: accessToken
    })
        .select({
            userId: 1
        })
        .exec(function (error, userId) {
            if (!userId) {
                error = {
                    status: 403,
                    message: 'Access token doesn\'t exist or expired: ' + accessToken
                };
                logger.error(error);
                deferred.reject(error);

                return;
            }

            if (error) {
                logger.error('Access token doesn\'t exist or expired: ' + userId);
                logger.error(error);
                deferred.reject(error);
            } else {
                logger.info('User with given access token was successfully found: ' + userId);
                deferred.resolve(userId.userId);
            }
        });

    return deferred.promise;
};

var projectController = {

    /**
     * Create new blank project
     * @params {Object} data
     *
     * @returns {promise}
     */
    post: function (data) {
        var deferred = Q.defer();
        var newProject;

        //TODO: validate every entity before set it to project
        newProject = new ProjectModel({
            name: data.name,
            owners: [data.userId],
            users: [data.userId],
            accounts: data.accounts ? [data.accounts]: [],
            currencies: data.currencies ? [data.currencies]: [],
            categories: data.categories ? [data.categories]: [],
            widgets: data.widgets ? [data.widgets]: [],
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

            ProjectModel.populate(project, 'owners users currencies createdBy modifiedBy', function (error, project) {
                if (error) {
                    logger.error('New project cannot be populated');
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                // Find User and add project id to projects field
                userController.getById({
                    id: data.userId
                })
                    .then(function (user) {
                        user.update({
                            $addToSet: {
                                projects: project._id
                            }
                        })
                            .exec(function (error) {
                                if (error) {
                                    logger.error(error);
                                    logger.error('Project with given id wasn\'t added to user: ' + data.userId);
                                    deferred.reject(error);

                                    return;
                                }

                                logger.info('New project has been successfully created: ' + project._id);
                                deferred.resolve(project);
                            })
                    })
                    .fail(function (error) {
                        logger.error(error);
                        logger.error('Project with given id wasn\'t added to user: ' + data.userId);
                        deferred.reject(error);
                    })
            })
        });

        return deferred.promise;
    },

    /**
     * Get project by given id
     * @param {Object} data
     * @param {ObjectId | string} data.id
     * @param {ObjectId | string} data.userId
     *
     * @returns {promise}
     */
    getById: function (data) {
        var deferred = Q.defer();

            ProjectModel.findOne({
                $and: [
                    {
                        users: data.userId
                    },
                    {
                        _id: data.id
                    }
                ]
            })
                .populate('owners users currencies createdBy modifiedBy')
                .exec(function (error, project) {
                    if (!project) {
                        error = {
                            status: 404,
                            message: 'Project with given id wasn\'t found: ' + data.id
                        };
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    if (error) {
                        logger.error('Project with given id wasn\'t found: ' + data.id);
                        logger.error(error);
                        deferred.reject(error);
                    } else {
                        logger.info('Project with given id was successfully found: ' + data.id);
                        deferred.resolve(project);
                    }
                });

        return deferred.promise;
    },

    /**
     * Get get all projects
     * @param {Object} data
     * @param {ObjectId | string} data.userId
     *
     * @returns {promise}
     */
    getAll: function (data) {
        var deferred = Q.defer();

        ProjectModel.find({
            users: data.userId
        })
            .populate('owners users currencies createdBy modifiedBy')
            .exec(function (error, projects) {
                if (!projects) {
                    error = {
                        status: 404,
                        message: 'Projects with given user weren\'t found: ' + data.userId
                    };
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                if (error) {
                    logger.error('Projects with given user weren\'t found: ' + data.userId);
                    logger.error(error);
                    deferred.reject(error);
                } else {
                    logger.info('Projects with given user were successfully found: ' + data.userId);
                    deferred.resolve(projects);
                }
            });

        return deferred.promise;
    },

    /**
     * Add currencies array to given project
     * @param {Object} data
     * @param {ObjectId | string} data.id
     * @param {ObjectId | string} data.userId
     * @param {ObjectId[] | string[]} data.currencies
     *
     * @returns {promise}
     */
    updateCurrencies: function (data) {
        var deferred = Q.defer();
        var error;
        var project;
        var that = this;

        validation.isArrayOfEntitiesValid(data.currencies, CurrencyModel)
            .then(function (currencies) {
                that.getById({
                    id: data.id,
                    userId: data.userId
                })
                    .then(function (project) {
                        if (!validation.isOwner(data.userId, project.owners)) {
                            error = {
                                status: 403,
                                message: 'User doesn\'t have permissions for updating currencies to project: ' + data.userId
                            };

                            logger.error(error);
                            deferred.reject(error);

                            return;
                        }

                        project.update({
                            currencies: data.currencies
                        })
                            .exec(function (error) {
                                if (error) {
                                    logger.error(error);
                                    logger.error('Currencies were not updated to the project: ' + data.id);
                                    deferred.reject(error);

                                    return;
                                }

                                logger.info('Currencies were successfully updated to the project: ' + data.id);
                                deferred.resolve(currencies);
                            });
                    });
            })
            .fail(function (error) {
                logger.error(error);
                logger.error('Currencies were not added to the project: ' + data.id);
                deferred.reject(error);
            });

        return deferred.promise;
    },

    /**
     * Rename project with given name
     * @param {Object} data
     * @param {ObjectId | string} data.id
     * @param {ObjectId | string} data.userId
     * @param {string} data.name
     *
     * @returns {promise}
     */
    rename: function (data) {
        var deferred = Q.defer();
        var error;
        var project;

        this.getById({
            id: data.id,
            userId: data.userId
        })
            .then(function (project) {
                if (!validation.isOwner(data.userId, project.owners)) {
                    error = {
                        status: 403,
                        message: 'User doesn\'t have permissions for updating project name: ' + data.userId
                    };

                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                project.update({
                    name: data.name
                })
                    .exec(function (error) {
                        if (error) {
                            logger.error(error);
                            logger.error('Project name was not changed: ' + data.id);
                            deferred.reject(error);

                            return;
                        }

                        logger.info('Project name was successfully changed: ' + data.id);
                        deferred.resolve(data.name);
                    });
            })
            .fail(function (error) {
                logger.error(error);
                logger.error('Project name was not changed: ' + data.id);
                deferred.reject(error);
            });

        return deferred.promise;
    }
};

module.exports = projectController;
