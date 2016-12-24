"use strict";

/// Libs
const mongoose = require('mongoose');
/// Models
const Account = require('./account');
const Category = require('./category');
const Currency = require('./currency');
const User = require('./auth/user');
const Widget = require('./widget');
/// Local variables
let Schema = mongoose.Schema;
let Project;
let ProjectSchema;
/// Plugins
const notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

/**
 * Project mongoose schema.
 * @class models/ProjectSchema
 */
ProjectSchema = new Schema({
    /**
     * The project owners links.
     *
     * @type ObjectId[]
     * @memberof models/ProjectSchema
     */
    owners: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    /**
     * The project name.
     *
     * @type String
     * @default Your New Project
     * @memberof models/ProjectSchema
     */
    name: {
        type: String,
        required: true,
        default: 'Your New Project'
    },

    /**
     * The project users links.
     *
     * @type ObjectId[]
     * @memberof models/ProjectSchema
     */
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    /**
     * The project accounts links.
     *
     * @type ObjectId[]
     * @memberof models/ProjectSchema
     */
    accounts: [{
        type: Schema.Types.ObjectId,
        ref: Account
    }],

    /**
     * The project main currency link.
     *
     * @type ObjectId
     * @memberof models/ProjectSchema
     */
    mainCurrency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },

    /**
     * The project currencies links.
     *
     * @type ObjectId[]
     * @memberof models/ProjectSchema
     */
    currencies: [{
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    }],

    /**
     * The project categories links.
     *
     * @type ObjectId[]
     * @memberof models/ProjectSchema
     */
    categories: [{
        type: Schema.Types.ObjectId,
        ref: Category
    }],

    /**
     * The project widgets links.
     *
     * @type ObjectId[]
     * @memberof models/ProjectSchema
     */
    widgets: [{
        type: Schema.Types.ObjectId,
        ref: Widget
    }],

    /**
     * The project creation date.
     *
     * @type Date
     * @memberof models/ProjectSchema
     */
    created: {
        type: Date,
        required: true
    },

    /**
     * The project creator link.
     *
     * @type ObjectId
     * @memberof models/ProjectSchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * The date of the last modification.
     *
     * @type ObjectId
     * @memberof models/ProjectSchema
     */
    modified: {
        type: Date,
        required: true,
        default: Date.now
    },

    /**
     * The author of the last modification.
     *
     * @type ObjectId
     * @memberof models/ProjectSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

ProjectSchema.plugin(notFoundErrorHandler);

if (mongoose.models.Project) {
    Project = mongoose.model('Project');
} else {
    Project = mongoose.model('Project', ProjectSchema);
}

module.exports = Project;
