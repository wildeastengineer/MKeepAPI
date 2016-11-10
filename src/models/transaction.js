/// Libs
const mongoose = require('mongoose');
/// Models
const Account = require('./account');
const Category = require('./category');
const Project = require('./project');
const User = require('./auth/user');
/// Local variables
let Schema = mongoose.Schema;
let Transaction;
/// Plugins
const mongoosePaginate = require('mongoose-paginate');
const notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

/**
 * Transaction mongoose schema.
 * @class models/TransactionSchema
 */
let TransactionSchema = new Schema({
    _owner: 'String',

    /**
     * The category link.
     *
     * @type ObjectId
     * @memberof models/TransactionSchema
     */
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    /**
     * The account value. - TODO: delete
     *
     * @type Number
     * @memberof models/TransactionSchema
     */
    accountValue: Number,

    /**
     * The transaction value.
     *
     * @type Number
     * @memberof models/TransactionSchema
     */
    transactionValue: {
        type: Number
    },

    /**
     * The transaction type. Can be 'income', 'expense' or 'transfer'.
     *
     * @type String
     * @memberof models/TransactionSchema
     */
    transactionType: {
        type: String,
        enum: ['income', 'expense', 'transfer']
    },

    /**
     * The source account link. - TODO: rename
     *
     * @type ObjectId
     * @memberof models/TransactionSchema
     */
    accountSource: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },

    /**
     * The destination account link. - TODO: rename
     *
     * @type ObjectId
     * @memberof models/TransactionSchema
     */
    accountDestination: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },

    /**
     * The transaction comment.
     *
     * @type String
     * @memberof models/TransactionSchema
     */
    note: String,

    /**
     * The project link.
     *
     * @type ObjectId
     * @memberof models/TransactionSchema
     */
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },

    /**
     * The transaction creation date.
     *
     * @type Date
     * @memberof models/TransactionSchema
     */
    created: {
        type: Date,
        required: true
    },

    /**
     * The transaction creation author link.
     *
     * @type ObjectId
     * @memberof models/TransactionSchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * The last transaction modification date.
     *
     * @type ObjectId
     * @memberof models/TransactionSchema
     */
    modified: {
        type: Date,
        required: true,
        default: Date.now
    },

    /**
     * The last transaction modification author link.
     *
     * @type ObjectId
     * @memberof models/TransactionSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

TransactionSchema.plugin(mongoosePaginate);
TransactionSchema.plugin(notFoundErrorHandler);

if (mongoose.models.Transaction) {
    Transaction = mongoose.model('Transaction');
} else {
    Transaction = mongoose.model('Transaction', TransactionSchema);
}

module.exports = Transaction;
