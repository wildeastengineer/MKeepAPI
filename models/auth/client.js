/// Libs
var mongoose = require('mongoose');
/// Local variables
var Schema = mongoose.Schema;

/**
 * Client mongoose schema.
 * @class models/ClientSchema
 */
var ClientSchema = new Schema({
    /**
     * The client name.
     *
     * @type String
     * @memberof models/ClientSchema
     */
    name: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The client id.
     *
     * @type String
     * @memberof models/ClientSchema
     */
    clientId: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The client secret.
     *
     * @type String
     * @memberof models/ClientSchema
     */
    clientSecret: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Client', ClientSchema);
