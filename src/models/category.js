/// Libs
const mongoose = require('mongoose');
/// Models
const User = require('./auth/user');
/// Local variables
let Category;
let Schema = mongoose.Schema;
/// Plugins
const notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

/**
 * Category mongoose schema.
 * @class models/CategorySchema
 */
let CategorySchema = new Schema({
    _owner: 'String',

    /**
     * The name of category.
     *
     * @type String
     * @memberof models/CategorySchema
     */
    name: {
        type: String,
        required: true,
        default: 'Your New Category'
    },

    /**
     * The type of category. Can be 'income' or 'expense'.
     *
     * @type String
     * @memberof models/CategorySchema
     */
    categoryType: {
        type: String,
        enum: ['income', 'expense']
    },

    /**
     * The link to parent category.
     *
     * @type ObjectId
     * @memberof models/CategorySchema
     */
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    /**
     * The date of category creation.
     *
     * @type Date
     * @memberof models/CategorySchema
     */
    created: {
        type: Date,
        required: true
    },

    /**
     * The link to the author of category.
     *
     * @type ObjectId
     * @memberof models/CategorySchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * The date of the last category modification.
     *
     * @type Date
     * @memberof models/CategorySchema
     */
    modified: {
        type: Date,
        required: true,
        default: Date.now
    },

    /**
     * The link to the author of the last modification.
     *
     * @type ObjectId
     * @memberof models/CategorySchema
     */
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
