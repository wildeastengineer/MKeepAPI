var categoryController = require('../controllers/category.js');

var categoryRegisterRoutes = function (router, isAuthorized, sendError) {
    router.route('/categories')
        .get(isAuthorized, function (req, res) {
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
        .post(isAuthorized, function (req, res) {
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
        .get(isAuthorized, function (req, res) {
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
        .get(isAuthorized, function (req, res) {
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
        .get(isAuthorized, function (req, res) {
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
        .put(isAuthorized, function (req, res) {
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
        .delete(isAuthorized, function (req, res) {
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
