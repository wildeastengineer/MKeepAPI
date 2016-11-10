/// Controllers
const categoryController = require('../controllers/category.js');

/**
 * Categories routes.
 * @class routes/Category
 */
let categoryRegisterRoutes = function (router, authenticate, sendError) {
    router.route('/categories')
        /**
         * Get the list of all categories
         *
         * @function
         * @name GET: /categories
         * @memberof routes/Category
         *
         * @returns {models/CategorySchema[]} categories
         */
        .get(authenticate, function (req, res) {
            categoryController.getAll(
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        })

        /**
         * Create new category
         *
         * @function
         * @name GET: /categories
         * @memberof routes/Category
         *
         * @param {String} name
         * @param {?String} parent - Id of parent category
         * @param {boolean} income - Income or expense category flag
         *
         * @returns {models/CategorySchema} category - New category
         */
        .post(authenticate, function (req, res) {
            categoryController.post(
                {
                    name: req.body.name,
                    parent: req.body.parent,
                    income: req.body.income
                },
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        });

    router.route('/categories/income')
        /**
         * Get the list of income categories
         *
         * @function
         * @name GET: /categories/income
         * @memberof routes/Category
         *
         * @returns {models/CategorySchema[]} categories
         */
        .get(authenticate, function (req, res) {
            categoryController.getIncome(
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        });

    router.route('/categories/expense')
        /**
         * Get the list of expense categories
         *
         * @function
         * @name GET: /categories/expense
         * @memberof routes/Category
         *
         * @returns {models/CategorySchema[]} categories
         */
        .get(authenticate, function (req, res) {
            categoryController.getExpense(
                function (err, categories) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(categories);
                }
            );
        });

    router.route('/categories/:category_id')
        /**
         * Get category by id
         *
         * @function
         * @name GET: /categories/:category_id
         * @memberof routes/Category
         *
         * @returns {models/CategorySchema} category
         */
        .get(authenticate, function (req, res) {
            categoryController.getById(
                req.params.category_id,
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        })

        /**
         * Update category by id
         *
         * @function
         * @name PUT: /categories/:category_id
         * @memberof routes/Category
         *
         * @param {String} name - New category's name
         * @param {?String} parent - Parent category id or null
         *
         * @returns {models/CategorySchema} category - Updated category
         */
        .put(authenticate, function (req, res) {
            categoryController.update(
                req.params.category_id,
                {
                    name: req.body.name,
                    parent: req.body.parent
                },
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        })

        /**
         * Remove category by id
         *
         * @function
         * @name DELETE: /categories/:category_id
         * @memberof routes/Category
         *
         * @returns {models/CategorySchema} category - Removed category
         */
        .delete(authenticate, function (req, res) {
            categoryController.remove(
                req.params.category_id,
                function (err, category) {
                    if (err) {
                        sendError(err, res);

                        return;
                    }

                    res.json(category);
                }
            );
        });
};

module.exports = {
    register: categoryRegisterRoutes
};
