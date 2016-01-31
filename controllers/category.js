var Category = require('../models/category');
var categoryRoutes = require('./category_routes');

// ToDo: remove this when auth is implemented
var user = {
    _id: 777
};

var categoryController = {
    getAll: function (callback) {
        Category.find(
            {
                _owner: user._id
            })
            .populate('parent')
            .exec(callback);
    },
    getById: function (id, callback) {
        Category.findOne({
            _id: id,
            _owner: user._id
        })
            .populate('parent')
            .exec(callback);
    },
    getIncome: function (callback) {
        Category.find({
            _owner: user._id,
            income: true
        })
            .populate('parent')
            .exec(callback);
    },
    getExpense: function (callback) {
        Category.find({
            _owner: user._id,
            income: false
        })
            .populate('parent')
            .exec(callback);
    },
    post: function (data, callback) {
        var category = new Category();

        category._owner = user._id;
        category.name = data.name;
        category.parent = data.parent;
        category.income = data.income;

        category.save(callback);
    },
    update: function (id, data, callback) {
        Category.findOne(
            {
                _id: id,
                _owner: user._id
            },
            function (err, category) {
                if (err) {
                    callback(err);

                    return;
                }

                category.name = data.name || category.name;
                category.parent = data.parent;
                category.save(callback);
            }
        );
    },
    remove: function (id, callback) {
        Category.remove(
            {
                _id: id,
                _owner: user._id
            },
            function (err, result) {
                if (err) {
                    callback(err);

                    return;
                }

                Category.find(
                    {
                        _owner: user._id
                    })
                    .populate('parent')
                    .exec(callback);
            }
        );
    },
    registerRoutes: function (router, isAuthorized, sendError) {
        categoryRoutes(router, this, isAuthorized, sendError);
    }
};

module.exports = categoryController;
