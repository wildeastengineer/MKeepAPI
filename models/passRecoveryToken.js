/// Libs
var config = require('../libs/config');
var mongoose = require('mongoose');
/// Models
var User = require('./auth/user');
/// Local variables
var expiresAfter = config.get('passRecovery.tokenLife') || '12h';
var Schema = mongoose.Schema;

var passRecoveryTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        expires: expiresAfter
    }
});

module.exports = mongoose.model('passRecoveryToken', passRecoveryTokenSchema);
