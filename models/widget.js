/// Libs
var mongoose = require('mongoose');
/// Models
var User = require('./auth/user');
/// Local variables
var Schema = mongoose.Schema;
var Widget;
var WidgetSchema;

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

if (mongoose.models.Widget) {
    Widget = mongoose.model('Widget');
} else {
    Widget = mongoose.model('Widget', WidgetSchema);
}

module.exports = Widget;
