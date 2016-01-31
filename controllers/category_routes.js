module.exports = function (router, CategoryController, isAuthorized, sendError) {
    router.route('/categories')
        .get(isAuthorized, function (req, res) {
            CategoryController.getAll(
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
            CategoryController.post(
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
            CategoryController.getIncome(
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
            CategoryController.getExpense(
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
            CategoryController.getById(
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
            CategoryController.update(
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
            CategoryController.remove(
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
