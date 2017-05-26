"use strict";

/// Libs
const mongoose = require('mongoose');
/// Models
const User = require('./auth/user');
/// Local variables
let Schema = mongoose.Schema;
let Widget;
let WidgetSchema;
/// Plugins
const notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

WidgetSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Your New Widget'
    },
    created: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    modified: {
        type: Date,
        required: true,
        default: Date.now
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

WidgetSchema.plugin(notFoundErrorHandler);

if (mongoose.models.Widget) {
    Widget = mongoose.model('Widget');
} else {
    Widget = mongoose.model('Widget', WidgetSchema);
}

module.exports = Widget;
