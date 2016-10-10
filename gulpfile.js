var gulp = require('gulp');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');

gulp.task('docs', function (callback) {
    runSequence(
        'docs:clean',
        'docs:generate',
        callback
    );
});

gulp.task('docs:clean', function (callback) {
    rimraf('docs', callback);
});

gulp.task('docs:generate', shell.task([
    'node_modules/jsdoc/jsdoc.js ' +
    '-d docs ' +             // output directory
    './README.md ' +        // to include README.md as index contents
    '-r controllers models'
]));
