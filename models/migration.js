/// Libs
var mongoose = require('mongoose');
/// Local variables
var Migration;
var Schema = mongoose.Schema;

var MigrationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        required: true
    }
});

if (mongoose.models.Migration) {
    Migration = mongoose.model('Migration');
} else {
    Migration = mongoose.model('Migration', MigrationSchema);
}

module.exports = Migration;
