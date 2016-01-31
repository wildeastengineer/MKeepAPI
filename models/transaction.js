var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    _owner: 'String',
    date: 'Date',
    category: {
        type: 'ObjectId',
        ref: 'Category'
    },
    value: 'Number',
    type: 'String',
    accountSource: {
        type: 'ObjectId',
        ref: 'Account'
    },
    accountDestination: {
        type: 'ObjectId',
        ref: 'Account'
    },
    note: 'String'
});

TransactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Transaction', TransactionSchema);
