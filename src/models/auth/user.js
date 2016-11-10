/// Libs
const crypto = require('crypto');
const mongoose = require('mongoose');
/// Models
const Project = require('../project');
/// Local variables
let Schema = mongoose.Schema;
let User;
let UserSchema;

let validateEmail;

validateEmail = function (email) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return reg.test(email)
};

/**
 * User mongoose schema.
 * @class models/UserSchema
 */
UserSchema = new Schema({
    /**
     * The user name.
     *
     * @type String
     * @memberof models/UserSchema
     */
    username: {
        type: String,
        unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },

    /**
     * The hash os password.
     *
     * @type String
     * @memberof models/UserSchema
     */
    hashedPassword: {
        type: String,
        required: true
    },

    /**
     * The salt.
     *
     * @type String
     * @memberof models/UserSchema
     */
    salt: {
        type: String,
        required: true
    },

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/UserSchema
     */
    created: {
        type: Date
    },

    /**
     * The password recovery token.
     *
     * @type String
     * @memberof models/UserSchema
     */
    passRecoveryToken: {
        type: String
    },

    /**
     * The password recovery token creation date.
     *
     * @type Date
     * @memberof models/UserSchema
     */
    passRecoveryCreatedAt: {
        type: Date
    },

    /**
     * The date of the last user modification.
     *
     * @type Date
     * @memberof models/UserSchema
     */
    modified: {
        type: Date,
        default: Date.now
    },

    /**
     * The list of projects links.
     *
     * @type ObjectId[]
     * @memberof models/UserSchema
     */
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],

    /**
     * The used language abbr.
     *
     * @type String
     * @memberof models/UserSchema
     */
    lang: {
        type: String,
        enum: ['en', 'ru'],
        default: 'en'
    }
});

/**
 * @name userId
 * @type String
 * @memberof models/UserSchema
 * @virtual
 */
UserSchema.virtual('userId')
    .get(function () {
        return this.id;
    });

/**
 * @name password
 * @type String
 * @memberof models/UserSchema
 * @virtual
 */
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
 * @function
 * @name encryptPassword
 * @memberof models/UserSchema
 *
 * @param {string} password
 *
 * @returns {string} encryptedPass
 */
UserSchema.methods.encryptPassword = function (password) {
    let encryptedPass;

    encryptedPass = crypto.createHmac('sha1', this.salt).update(password).digest('hex');

    return encryptedPass;
};

/**
 * @function
 * @name checkPassword
 * @memberof models/UserSchema
 *
 * @param {string} password
 *
 * @returns {boolean}
 */
UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    User = mongoose.model('User', UserSchema);
}

module.exports = User;
