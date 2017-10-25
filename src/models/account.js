/// Libs
const mongoose = require('mongoose');
/// Models
const Currency = require('./currency');
/// Local variables
let Account;
let Schema = mongoose.Schema;
/// Plugins
const notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

/**
 * Accounts mongoose schema.
 * @class models/AccountSchema
 */
let AccountSchema = new Schema({
    /**
     * The name of account.
     *
     * @type String
     * @memberof models/AccountSchema
     */
    name:  {
        type: String,
        required: true,
        default: 'Your New Account'
    },

    /**
     * Current account balance.
     *
     * @type Number
     * @memberof models/AccountSchema
     */
    value: Number,

    /**
     * Account balance at creation moment.
     *
     * @type Number
     * @memberof models/AccountSchema
     */
    initValue: {
        type: Number,
        required: true
    },

    /**
     * The link to used currency.
     *
     * @type ObjectId
     * @memberof models/AccountSchema
     */
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/AccountSchema
     */
    created: {
        type: Date,
        required: true
    },

    /**
     * The link to the creator of account.
     *
     * @type ObjectId
     * @memberof models/AccountSchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * The date of the last account modification.
     *
     * @type Date
     * @memberof models/AccountSchema
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
     * @memberof models/AccountSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

AccountSchema.plugin(notFoundErrorHandler);

if (mongoose.models.Account) {
    Account = mongoose.model('Account');
} else {
    Account = mongoose.model('Account', AccountSchema);
}

module.exports = Account;
