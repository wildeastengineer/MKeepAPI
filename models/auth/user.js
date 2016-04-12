var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema;

UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
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

UserSchema.methods.encryptPassword = function (password) {
    var encryptedPass;

    encryptedPass = crypto.createHmac('sha1', this.salt).update(password).digest('hex');

    return encryptedPass;
};

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


UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', UserSchema);
