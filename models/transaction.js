/// Libs
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
/// Models
var Account = require('./account');
var Category = require('./category');
var Project = require('./project');
var User = require('./auth/user');
/// Local variables
var Schema = mongoose.Schema;
var Transaction;

var TransactionSchema = new Schema({
    _owner: 'String',
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    accountValue: Number,
    transactionValue: {
        type: Number
    },
    transactionType: {
        type: String,
        enum: ['income', 'expense', 'transfer']
    },
    accountSource: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    accountDestination: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    note: String,
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
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

TransactionSchema.plugin(mongoosePaginate);

if (mongoose.models.Transaction) {
    Transaction = mongoose.model('Transaction');
} else {
    Transaction = mongoose.model('Transaction', TransactionSchema);
}

module.exports = Transaction;
