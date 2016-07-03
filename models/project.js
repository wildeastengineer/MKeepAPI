/// Libs
var mongoose = require('mongoose');
/// Models
var Account = require('./account');
var Category = require('./category');
var Currency = require('./currency');
var User = require('./auth/user');
var Widget = require('./widget');
/// Local variables
var Schema = mongoose.Schema;
var Project;
var ProjectSchema;

ProjectSchema = new Schema({
    owners: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    name: {
        type: String,
        required: true,
        default: 'Your New Project'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    accounts: [{
        type: Schema.Types.ObjectId,
        ref: Account
    }],
    mainCurrency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        required: true,
        default: null
    },
    currencies: [{
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: Category
    }],
    widgets: [{
        type: Schema.Types.ObjectId,
        ref: Widget
    }],
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

if (mongoose.models.Project) {
    Project = mongoose.model('Project');
} else {
    Project = mongoose.model('Project', ProjectSchema);
}

module.exports = Project;
