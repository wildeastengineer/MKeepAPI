/// Libs
var mongoose = require('mongoose');
/// Models
var User = require('./auth/user');
/// Local variables
var Category;
var Schema = mongoose.Schema;
/// Plugins
var notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

var CategorySchema = new Schema({
    _owner: 'String',
    name: {
        type: String,
        required: true,
        default: 'Your New Category'
    },
    categoryType: {
        type: String,
        enum: ['income', 'expense']
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    created: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    modified: {
        type: Date,
        required: true,
        default: Date.now
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CategorySchema.plugin(notFoundErrorHandler);


if (mongoose.models.Category) {
    Category = mongoose.model('Category');
} else {
    Category = mongoose.model('Category', CategorySchema);
}

module.exports = Category;
