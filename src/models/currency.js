"use strict";

/// Libs
let mongoose = require('mongoose');
/// Local variables
let Currency;
let Schema = mongoose.Schema;
/// Plugins
let notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

/**
 * Currency mongoose schema.
 * @class models/CurrencySchema
 */
let CurrencySchema = new Schema({
    /**
     * ISO 4217 currency designator.
     *
     * @type String
     * @memberof models/CurrencySchema
     */
    iso: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The date of currency creation.
     *
     * @type Date
     * @memberof models/CurrencySchema
     */
    created: {
        type: Date,
        required: true
    },

    /**
     * The date of the last currency modification.
     *
     * @type Date
     * @memberof models/CurrencySchema
     */
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
