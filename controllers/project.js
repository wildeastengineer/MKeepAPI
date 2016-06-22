/// Libs
var async = require('async');
var Logger = require('../libs/log');
var Q = require('q');
var validation = require('../utils/validation');
/// Models
var currencyController = require('./currency');
var ProjectModel = require('../models/project');
/// Local variables
var logger = Logger(module);
/// Private functions
var isOwner;

/**
 * Create new blank project
 * @params {ObjectId} userId
 * @params {Object} project
 * @params {Objects[]} project.owners
 * @params {ObjectId[]} project.owners._id
 *
 * @returns {boolean}
 */
isOwner = function (userId, project) {
    var owners = [];
    var i;

    userId = userId.toString();

    for (i = 0; i < project.owners.length; i++) {
        owners.push(project.owners[i]._id.toString());
    }

    return owners.indexOf(userId) > -1;
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
            } else {
                logger.info('New project has been successfully created: ' + project._id);
                deferred.resolve(project);
            }
        });

        return deferred.promise;
    },

    /**
     * Get project by given id
     * @param {Object} data
     * @param {ObjectId} data.id
     *
     * @returns {promise}
     */
    getById: function (data) {
        var deferred = Q.defer();

        ProjectModel.findOne({
            _id: data.id
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
                    console.log(error);
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
     * @param {Object} data.project
     * @param {ObjectId} data.userId
     * @param {ObjectId[]} data.currencies
     *
     * @returns {promise}
     */
    addCurrencies: function (data) {
        var deferred = Q.defer();
        var error;
        var project;
        var that = this;

        if (!isOwner(data.userId, data.project)) {
            error = {
                status: 401,
                message: 'User doesn\'t have permissions for adding currencies to project: ' + data.userId
            };

            logger.error(error);
            deferred.reject(error);

            return deferred.promise;
        }

        async.eachSeries(data.currencies, function (currencyId, callback) {
            validation.isValidAndExist(currencyId, currencyController)
                .then(function (currency) {
                    // This method won't add duplicate ids to array.
                    // This is the only way to handle unique addition on DB level
                    ProjectModel.update({
                        _id: data.project._id
                    }, {
                        $addToSet: {
                            currencies: currency._id
                        }
                    }, function (error) {
                        if (error) {
                            callback(error)
                        }

                        callback();
                    });
                })
                .fail(function (error) {
                    callback(error);
                });
        }, function (error) {
            if (error) {
                logger.error(error);
                logger.error('Currencies were not added to the project: ' + data.project._id);
                deferred.reject(error);

                return;
            }

            that.getById({
                id: data.project._id
            })
                .then(function(project) {
                    logger.info('Currencies were successfully added to the project: ' + data.project._id);
                    deferred.resolve(project);
                })
                .fail(function (error) {
                    logger.error(error);
                    logger.error('Currencies were not added to the project: ' + data.project._id);
                    deferred.reject(error);
                })

        });

        return deferred.promise;
    }
};

module.exports = projectController;
