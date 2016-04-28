/// Libs
var crypto = require('crypto');
var mongoose = require('mongoose');
/// Local variables
var Schema = mongoose.Schema;
var UserSchema;

var validateEmail;

validateEmail = function (email) {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return reg.test(email)
};

UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.virtual('userId')
    .get(function () {
        return this.id;
    });

UserSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

/**
 * Encrypt password
 *
 * @param {string} password
 *
 * @returns {string} encryptedPass
 */
UserSchema.methods.encryptPassword = function (password) {
    var encryptedPass;

    encryptedPass = crypto.createHmac('sha1', this.salt).update(password).digest('hex');

    return encryptedPass;
};

/**
 * Check password
 *
 * @param {string} password
 *
 * @returns {boolean}
 */
UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', UserSchema);
