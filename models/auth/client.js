/// Libs
var mongoose = require('mongoose');
/// Local variables
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Client', ClientSchema);
