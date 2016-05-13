/// Libs
var Q = require('q');
var Logger = require('../libs/log');
/// Models
var ProjectModel = require('../models/Project');
/// Local variables
var logger = Logger(module);

var projectController = {
    /**
     * Create new blank project
     *
     * @returns {promise}
     */
    createProject: function (data) {
        var deferred = Q.defer();
        var newProject;

        newProject = new ProjectModel({
            //name use by default
            created: new Date()
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
    }
};

module.exports = projectController;
