//// Libs
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const CategoryModel = require('../models/category');
const ProjectModel = require('../models/project');
/// Controllers
/// Local variables
let logger = Logger(module);

/**
 * Categories controller.
 * @class categoryController
 */
let categoryController = {

    /**
     * Add given category to project categories
     *
     * @function
     * @name put
     * @memberof controllers/Category
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - Project's id
     * @param {Object} data.category
     * @param {String} data.category.name
     * @param {String} data.category.categoryType
     * @param {?(ObjectId|String)} data.category.parent
     * @param {(ObjectId[]|String[])} data.currencies
     *
     * @returns {Promise<models/CategorySchema[]|Error>}
     */
    put: function (data) {
        let deferred = Q.defer();

        if (!data.category) {
            const error = {
                name: 'ValidationError',
                message: 'Project category were not specified'
            };

            logger.error(error);
            deferred.reject(error);

            return deferred.promise;
        }

        //TODO: figure out why populate for categories.parent won't work and why validation on parent won't work iether
        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            $push:{
                categories: {
                    name: data.category.name,
                    categoryType: data.category.categoryType,
                    parent: data.category.parent,
                    created: new Date(),
                    createdBy: data.userId,
                    modifiedBy: data.userId,
                    modified: new Date()
                }
            }
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .exec(function (error, doc) {
                if (error) {
                    logger.error(error);
                    logger.error('Category was not added to project: ' + data.id);
                    deferred.reject(error);

                    return;
                }

                logger.info('Category was successfully added to project: ' + data.id);
                //TODO: better way to return what was added since returning the last in the list
                // might be added by another call in theory
                deferred.resolve(doc.categories.pop());
            });

        return deferred.promise;
    },

    /**
     * Get get all project categories
     *
     * @function
     * @name getAll
     * @memberof controllers/Currency
     * @param {(ObjectId|String)} data.id - project id
     *
     * @returns {Promise<models/CategorySchema[]|Error>}
     */
    getAll: function (data) {
        let deferred = Q.defer();

        ProjectModel.findOne({
            _id: data.id
        })
            .exec(function (error, projects) {
                if (error) {
                    logger.error('Categories of the project with given id were\'t found: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Categories of the project with given id were successfully found: ' + data.id);
                deferred.resolve(projects.categories);
            });

        return deferred.promise;
    }
};

module.exports = categoryController;
