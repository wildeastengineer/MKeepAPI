/// Libs
var mongoose = require('mongoose');
/// Local variables
var ExchangeRateService;
var Schema = mongoose.Schema;
/// Plugins
var notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

/**
 * Exchange rate service mongoose schema.
 * @class models/ExchangeRateServiceSchema
 */
var ExchangeRateServiceSchema = new Schema({
    /**
     * The name of service.
     *
     * @type String
     * @memberof models/ExchangeRateServiceSchema
     */
    name: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The abbreviation of service.
     *
     * @type String
     * @memberof models/ExchangeRateServiceSchema
     */
    abbreviation: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The URL address of service.
     *
     * @type String
     * @memberof models/ExchangeRateServiceSchema
     */
    url: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The date of the last rate update.
     *
     * @type Date
     * @memberof models/ExchangeRateServiceSchema
     */
    lastUpdate: {
        type: Date,
        required: true
    },

    /**
     * The update period in seconds.
     *
     * @type Number
     * @default 3600
     * @memberof models/ExchangeRateServiceSchema
     */
    updatePeriod: {
        type: Number
    },

    /**
     * The updating time.
     *
     * @type String
     * @default 00:00:00 GMT-0300
     * @memberof models/ExchangeRateServiceSchema
     */
    updateTime:  {
        type: String
    },

    /**
     * The name of the base currency.
     *
     * @type String
     * @memberof models/ExchangeRateServiceSchema
     */
    base: {
        type: String,
        ref: 'Currency',
        required: true
    },

    /**
     * The last received currency rates.
     *
     * @type Object
     * @memberof models/ExchangeRateServiceSchema
     */
    rates: {
        type: Schema.Types.Mixed
    },

    /**
     * The date of service creation.
     *
     * @type Date
     * @memberof models/ExchangeRateServiceSchema
     */
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
