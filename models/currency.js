/// Libs
var mongoose = require('mongoose');
/// Local variables
var Currency;
var Schema = mongoose.Schema;

var CurrencySchema = new Schema({
    _owner: 'String',
    name: {
        type: String,
        unique: true,
        required: true,
        default: 'Currency Name'
    },
    icon: {
        type: String,
        required: true
    },
    globalId: String,
    created: {
        type: Date,
        required: true
    },
    modified: {
        type: Date,
        required: true,
        default: Date.now
    }
});

if (mongoose.models.Currency) {
    Currency = mongoose.model('Currency');
} else {
    Currency = mongoose.model('Currency', CurrencySchema);
}

module.exports = Currency;
