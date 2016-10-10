/// Libs
var mongoose = require('mongoose');
/// Local variables
var Schema = mongoose.Schema;

/**
 * Access token mongoose schema.
 * @class models/AccessTokenSchema
 */
var AccessTokenSchema = new Schema({
    /**
     * The link to user.
     *
     * @type ObjectId
     * @memberof models/AccessTokenSchema
     */
    userId: {
        type: String,
        required: true
    },

    /**
     * The client id.
     *
     * @type String
     * @memberof models/AccessTokenSchema
     */
    clientId: {
        type: String,
        required: true
    },

    /**
     * The token.
     *
     * @type String
     * @memberof models/AccessTokenSchema
     */
    token: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The token creation date.
     *
     * @type Date
     * @memberof models/AccessTokenSchema
     */
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);
