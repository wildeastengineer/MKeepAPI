/// Libs
var mongoose = require('mongoose');
/// Models
var Currency = require('./currency');
var User = require('./auth/user');
/// Local variables
var Account;
var Schema = mongoose.Schema;
/// Plugins
var notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

var AccountSchema = new Schema({
    _owner: 'String',
    name:  {
        type: String,
        required: true,
        default: 'Your New Account'
    },
    value: Number,
    initValue: {
        type: Number,
        required: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
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

AccountSchema.plugin(notFoundErrorHandler);

if (mongoose.models.Account) {
    Account = mongoose.model('Account');
} else {
    Account = mongoose.model('Account', AccountSchema);
}

module.exports = Account;
