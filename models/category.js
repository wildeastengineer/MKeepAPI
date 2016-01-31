var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    _owner: 'String',
    name: 'String',
    income: 'Boolean',
    parent: {
        type: 'ObjectId',
        ref: 'Category'
    }
});

module.exports = mongoose.model('Category', CategorySchema);
