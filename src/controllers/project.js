/// Libs
const Logger = require('../libs/log');
const Q = require('q');
/// Models
const UserModel = require('../models/auth/user');
const ProjectModel = require('../models/project');
/// Controllers
const AccountController = require('./account');
const CategoryController = require('./category');
const CurrencyController = require('./currency');
const TransactionController = require('./transaction');
/// Local variables
const logger = Logger(module);
/// Private functions

/**
 * Projects controller.
 * @class controllers/Project
 */
module.exports = {
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
    post(data) {
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

        newProject.save((error, project) => {
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
                .exec((error, doc) => {
                    if (error) {
                        logger.error('Project with given id wasn\'t added to user: ' + data.userId);
                        logger.error(error);
                        deferred.reject(error);

                        return;
                    }

                    ProjectModel.populate(project, 'owners users currencies mainCurrency createdBy modifiedBy',
                        (error, project) => {
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
     * Get project by id and setup active project for given user
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
    getById(data) {
        let deferred = Q.defer();

        ProjectModel.findOne({
            users: data.userId,
            _id: data.id
        })
            .populate('owners users currencies mainCurrency createdBy modifiedBy')
            .exec((error, project) => {
                if (error) {
                    logger.error('Project with given id wasn\'t found: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Project with given id was successfully found: ' + data.id);

                UserModel.findOne({
                    _id: data.userId
                })
                    .exec((error, user) => {
                        if (error) {
                            logger.error('Cannot find user during getting project by id: ' + data.userId);
                            logger.error(error);
                            deferred.reject(error);

                            return;
                        }

                        if (!user.activeProject || user.activeProject.toString() !== project._id.toString()) {
                            logger.info('Active project was set upped for user: ' + data.userId);
                            user.activeProject = project._id;
                            user.save();
                        }

                        deferred.resolve(project);
                    });
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
    getAll(data) {
        let deferred = Q.defer();

        ProjectModel.find({
            users: data.userId
        })
            .populate('owners users currencies mainCurrency createdBy modifiedBy')
            .exec((error, projects) => {
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
    updateCurrencies(data) {
        return CurrencyController.updateProjectCurrencies(data);
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
    updateMainCurrency(data) {
        return CurrencyController.updateProjectMainCurrency(data);
    },

    /**
     * Rename project with given name
     *
     * @function
     * @name rename
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     * @param {String} data.name
     *
     * @returns {Promise<String|Error>} - New project name
     */
    rename(data) {
        let deferred = Q.defer();

        ProjectModel.findOneAndUpdate({
            _id: data.id,
            owners: data.userId
        }, {
            name: data.name
        }, {
            runValidators: true,
            new: true //return the modified document rather than the original
        })
            .exec((error, doc) => {
                if (error) {
                    logger.error('Project was not renamed: ' + data.id);
                    logger.error(error);
                    deferred.reject(error);

                    return;
                }

                logger.info('Project was successfully renamed: ' + data.id);
                deferred.resolve(doc.name);
            });

        return deferred.promise;
    },

    /**
     * Add given category to project categories
     *
     * @function
     * @name addCategory
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - Project's id
     * @param {(ObjectId|String)} data.userId
     * @param {Object} data.category
     * @param {String} data.category.name
     * @param {String} data.category.categoryType
     * @param {?(ObjectId|String)} data.category.parent
     *
     * @returns {Promise<models/CategorySchema|Error>}
     */
    addCategory(data) {
        return CategoryController.put(data);
    },

    /**
     * Get get all project categories
     *
     * @function
     * @name getCategories
     * @memberof controllers/Category
     * @param {(ObjectId|String)} data.id - project id
     *
     * @returns {Promise<models/CategorySchema[]|Error>}
     */
    getCategories(data) {
        return CategoryController.getAll(data);
    },

    /**
     * Update given project categories
     *
     * @function
     * @name updateCategory
     * @memberof controllers/Project
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     * @param {Object} data.category
     * @param {(ObjectId|String)} data.category.id
     * @param {String} data.category.name
     * @param {String} data.category.categoryType
     * @param {?(ObjectId|String)} data.category.parent
     *
     * @returns {Promise<models/CategorySchema|Error>}
     */
    updateCategory(data) {
        return CategoryController.updateCategory(data);
    },

    /**
     * Delete given project categories
     *
     * @function
     * @name deleteCategory
     * @memberof controllers/Project
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.categoryId
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<void|Error>}
     */
    deleteCategory(data) {
        return CategoryController.deleteCategory(data);
    },
    /**
     *
     * Create new account and add it to the give project
     *
     * @function
     * @name addAccount
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.account
     * @param {String} data.account.name
     * @param {Number} data.account.value
     * @param {Number} data.account.initValue
     * @param {?(ObjectId|String)} data.account.currency
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    addAccount(data) {
        return AccountController.put(data);
    },

    /**
     * Get accounts by project id
     *
     * @function
     * @name getAccounts
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     *
     * @returns {Promise<models/AccountSchema[]|Error>}
     */
    getAccounts(data) {
        return AccountController.getAll(data);
    },

    /**
     * Update account
     *
     * @function
     * @name updateAccount
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.account
     * @param {(ObjectId|String)} data.account.id - account id
     * @param {?String} data.account.name
     * @param {?(ObjectId|String)} data.account.currency
     * @param {?Number} data.account.value
     * @param {?Number} data.account.initValue
     *
     * @returns {Promise<models/AccountSchema|Error>}
     */
    updateAccount(data) {
        return AccountController.updateAccount(data);
    },

    /**
     * Delete given account from project
     *
     * @function
     * @name deleteAccount
     * @memberof controllers/Project
     *
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.accountId
     *
     * @returns {Promise<void|Error>}
     */
    deleteAccount(data) {
        return AccountController.deleteAccount(data);
    },


    /**
     * Create new transaction
     *
     * @function
     * @name post
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.transaction
     * @param {String} data.transaction.type
     * @param {Number} data.transaction.value
     * @param {String} data.transaction.note
     * @param {?(ObjectId|String)} data.transaction.category
     * @param {?(ObjectId|String)} data.transaction.accountSource
     * @param {?(ObjectId|String)} data.transaction.accountDestination
     *
     * @returns {Promise<models/TransactionSchema|Error>}
     */
    addTransaction(data) {
        return TransactionController.post(data);
    },

    /**
     * Update transaction
     *
     * @function
     * @name update
     * @memberof controllers/Project
     *
     * @param {Object} data
     * @param {(ObjectId|String)} data.userId
     * @param {(ObjectId|String)} data.id - project id
     * @param {Object} data.transaction
     * @param {(ObjectId|String)} data.transaction.id
     * @param {String} data.transaction.type
     * @param {Number} data.transaction.value
     * @param {String} data.transaction.note
     * @param {?(ObjectId|String)} data.transaction.category
     * @param {?(ObjectId|String)} data.transaction.accountSource
     * @param {?(ObjectId|String)} data.transaction.accountDestination
     *
     * @returns {Promise<models/TransactionSchema|Error>}
     */
    updateTransaction(data) {
        return TransactionController.update(data);
    },

    /**
     * Get get all transaction by projectId
     *
     * @function
     * @name getAllByProjectId
     * @memberof controllers/Project
     * @param {(ObjectId|String)} id - project id
     *
     * @returns {Promise<models/TransactionSchema[]|Error>}
     */
    getTransactions(id) {
        return TransactionController.getAllByProjectId(id)
    },

    /**
     * Delete transaction
     *
     * @function
     * @name delete
     * @memberof controllers/Project
     * @param {(ObjectId|String)} data.id - project id
     * @param {(ObjectId|String)} data.transactionId
     *
     * @returns {Promise<void|Error>}
     */
    deleteTransaction(data) {
        return TransactionController.delete(data);
    }
};
