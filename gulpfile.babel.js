// Libraries
const config = require('./gulp-tasks/config');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const jshintConfig = require('./jshintConfig');
const runSequence = require('run-sequence');

require('./gulp-tasks/gulp-build')(gulp, config);
require('./gulp-tasks/gulp-docs')(gulp, config);
require('./gulp-tasks/gulp-test')(gulp, config);

gulp.task('default', function () {
    var stream = nodemon({
        script: `${config.sourceFolder}/server.js`,
        execMap: {
            js: 'babel-node'
        },
        verbose: true,
        ext: 'html js json'
    });

    stream.on('restart', function () {
        console.log('======== restarted! ======== ')
    })
        .on('crash', function() {
            console.error('======== Application has crashed! ======== \n');
            stream.emit('restart', 10);  // restart the server in 10 seconds
        })
});

gulp.task('build', function (callback) {
    runSequence(
        'build:clean',
        'build:transpile',
        'build:copy-dependencies',
        'build:start',
        callback
    );
});

gulp.task('test', (callback) => {
    runSequence(
        'test:unit-public',
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
