/// Libs
var Logger = require('../libs/log');
var Q = require('q');
/// Models
var UserModel = require('../models/auth/user');
var ProjectModel = require('../models/project');
/// Controllers
/// Local variables
var logger = Logger(module);
/// Private functions

var projectController = {

    /**
     * Create new blank project
     * @params {Object} data
     * @params {string} data.name
     * @params {ObjectId | string} data.userId
     * @params [Object[]] data.accounts
     * @params [ObjectId[] | string[]] data.currencies
     * @params {ObjectId | string} data.mainCurrency
     * @params [Object[]] data.categories
     * @params [Object[]] data.widgets
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
     * Add currencies array to given project
     * @param {Object} data
     * @param {ObjectId | string} data.id - project id
     * @param {ObjectId | string} data.userId
     * @param {ObjectId[] | string[]} data.currencies
     *
     * @returns {promise}
     */
    updateCurrencies: function (data) {
        var deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            currencies: data.currencies
        }, {
            runValidators: true
        })
            .populate('currencies')
            .exec(function (error, doc) {
                if (error) {
                    logger.error(error);
                    logger.error('Project currencies were not updated: ' + data.id);
                    deferred.reject(error);

                    return;
                }

                logger.info('Project currencies were successfully updated: ' + data.id);
                deferred.resolve(doc.currencies);
            });

        return deferred.promise;
    },

    /**
     * Update main project currency
     * @param {Object} data
     * @param {ObjectId | string} data.id - project id
     * @param {ObjectId | string} data.userId
     * @param {ObjectId | string} data.mainCurrency
     *
     * @returns {promise}
     */
    updateMainCurrency: function (data) {
        var deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            mainCurrency: data.mainCurrency
        }, {
            runValidators: true
        })
            .populate('mainCurrency')
            .exec(function (error, doc) {
                if (error) {
                    logger.error(error);
                    logger.error('Project main currency was not updated: ' + data.id);
                    deferred.reject(error);

                    return;
                }

                logger.info('Project main currency was successfully changed: ' + data.id);
                deferred.resolve(doc.mainCurrency);
            });

        return deferred.promise;
    },

    /**
     * Rename project with given name
     * @param {Object} data
     * @param {ObjectId | string} data.id - project id
     * @param {ObjectId | string} data.userId
     * @param {string} data.name
     *
     * @returns {promise}
     */
    rename: function (data) {
        var deferred = Q.defer();

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
