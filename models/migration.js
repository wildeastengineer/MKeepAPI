/// Libs
var mongoose = require('mongoose');
/// Local variables
var Migration;
var Schema = mongoose.Schema;
/// Plugins
var notFoundErrorHandler = require('../utils/mongoosePlugins/notFoundErrorHandler.js');

/**
 * DB migration mongoose schema.
 * @class models/MigrationSchema
 */
var MigrationSchema = new Schema({
    /**
     * The name of migration.
     *
     * @type String
     * @memberof models/MigrationSchema
     */
    name: {
        type: String,
        required: true
    },

    /**
     * The file name with migration's code.
     *
     * @type String
     * @memberof models/MigrationSchema
     */
    fileName: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The date when migation was applied.
     *
     * @type String
     * @memberof models/MigrationSchema
     */
    date: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The migration creation date.
     *
     * @type String
     * @memberof models/MigrationSchema
     */
    created: {
        type: Date,
        required: true
    }
});

MigrationSchema.plugin(notFoundErrorHandler);

if (mongoose.models.Migration) {
    Migration = mongoose.model('Migration');
} else {
    Migration = mongoose.model('Migration', MigrationSchema);
}

module.exports = Migration;
