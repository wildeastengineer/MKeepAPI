var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintConfig = require('./jshintConfig');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');

var foldersToJsDoc = [
    'controllers',
    'models',
    'routes'
];

var filesToJsHint = [
    'controllers/*.js',
    'fixtures/*.js',
    'libs/*.js',
    'models/*.js',
    'models/**/*.js',
    'routes/*.js',
    'utils/*.js',
    'utils/**/*.js',
    'gulpfile.js',
    'jshintConfig.js',
    'server.js'
];

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
    '-r ' + foldersToJsDoc.join(' ')
]));

gulp.task('jshint', function () {
    return gulp.src(filesToJsHint)
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});
