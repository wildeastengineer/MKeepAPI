const rimraf = require('rimraf');
const shell = require('gulp-shell');

module.exports = function (gulp, config) {
    gulp.task('docs:clean', function (callback) {
        rimraf('docs', callback);
    });

    gulp.task('docs:generate', shell.task([
        'node_modules/jsdoc/jsdoc.js ' +
        '-d docs ' +             // output directory
        './README.md ' +        // to include README.md as index contents
        '-r ' + config.foldersToJsDoc.join(' ')
    ]));
};
