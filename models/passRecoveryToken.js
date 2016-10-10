/// Libs
var config = require('../libs/config');
var mongoose = require('mongoose');
/// Models
var User = require('./auth/user');
/// Local variables
var expiresAfter = config.get('passRecovery.tokenLife') || '12h';
var Schema = mongoose.Schema;

/**
 * Pass recovery token mongoose schema.
 * @class models/PassRecoveryTokenSchema
 */
var PassRecoveryTokenSchema = new Schema({
    /**
     * The link to user.
     *
     * @type ObjectId
     * @memberof models/PassRecoveryTokenSchema
     */
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },

    /**
     * The token.
     *
     * @type String
     * @memberof models/PassRecoveryTokenSchema
     */
    token: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/PassRecoveryTokenSchema
     */
    created: {
        type: Date,
        expires: expiresAfter
    }
});

module.exports = mongoose.model('passRecoveryToken', PassRecoveryTokenSchema);
