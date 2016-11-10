/// Libs
const mongoose = require('mongoose');
/// Local variables
let Schema = mongoose.Schema;

/**
 * Refresh token mongoose schema.
 * @class models/RefreshTokenSchema
 */
let RefreshTokenSchema = new Schema({
    /**
     * The link to user.
     *
     * @type String
     * @memberof models/RefreshTokenSchema
     */
    userId: {
        type: String,
        required: true
    },

    /**
     * The client id.
     *
     * @type String
     * @memberof models/RefreshTokenSchema
     */
    clientId: {
        type: String,
        required: true
    },

    /**
     * The token.
     *
     * @type String
     * @memberof models/RefreshTokenSchema
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
     * @memberof models/RefreshTokenSchema
     */
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
