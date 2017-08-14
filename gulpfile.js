// Libraries
const config = require('./gulp-tasks/config');
const gulp = require('gulp');
const guppy = require('git-guppy')(gulp);
const jshint = require('gulp-jshint');
const jshintConfig = require('./jshintConfig');
const runSequence = require('run-sequence');

require('./gulp-tasks/gulp-docs')(gulp, config);
require('./gulp-tasks/gulp-test')(gulp, config);

gulp.task('test', (callback) => {
    runSequence(
        'test:all',
        callback
    );
});

gulp.task('docs', function (callback) {
    runSequence(
        'docs:clean',
        'docs:generate',
        callback
    );
});

gulp.task('jshint', function () {
    return gulp.src(config.filesToJsHint)
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('pre-commit', ['test']); // add jshint task when we fix all code style errors
