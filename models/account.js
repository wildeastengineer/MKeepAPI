var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    _owner: 'String',
    name: 'String',
    value: 'Number',
    initValue: 'Number',
    currency: {
        type: 'ObjectId',
        ref: 'Currency'
    }
});

module.exports = mongoose.model('Account', AccountSchema);
