/// Libs
var mongoose = require('mongoose');
/// Local variables
var ExchangeRateService;
var Schema = mongoose.Schema;
/// Plugins
var notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

var ExchangeRateServiceSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    app_id: {
        type: String
    },
    url: {
        type: String,
        unique: true,
        required: true
    },
    lastUpdate: {
        type: Date,
        required: true
    },
    // updating period in ms: 24 * 60 * 60 * 1000 use it if update time is not specified
    updatePeriod: {
        type: Number
    },
    // updating time use it if update period is not specified  format: 00:00:00 GMT-0300
    updateTime:  {
        type: String
    },
    base: {
        type: String,
        ref: 'Currency',
        required: true
    },
    rates: {
        type: Schema.Types.Mixed
    },
    created: {
        type: Date,
        required: true
    }
});

ExchangeRateServiceSchema.plugin(notFoundErrorHandler);

if (mongoose.models.ExchangeRateService) {
    ExchangeRateService = mongoose.model('ExchangeRateService');
} else {
    ExchangeRateService = mongoose.model('ExchangeRateService', ExchangeRateServiceSchema);
}

module.exports = ExchangeRateService;
