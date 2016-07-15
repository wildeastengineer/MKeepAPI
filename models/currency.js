/// Libs
var mongoose = require('mongoose');
/// Local variables
var Currency;
var Schema = mongoose.Schema;
/// Plugins
var notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

var CurrencySchema = new Schema({
    iso: {
        type: String,
        unique: true,
        required: true
    },
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

CurrencySchema.plugin(notFoundErrorHandler);

if (mongoose.models.Currency) {
    Currency = mongoose.model('Currency');
} else {
    Currency = mongoose.model('Currency', CurrencySchema);
}

module.exports = Currency;
