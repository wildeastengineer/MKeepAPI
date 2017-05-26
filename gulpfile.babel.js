// Libraries
const config = require('./gulp-tasks/config');
const gulp = require('gulp');
const guppy = require('git-guppy')(gulp);
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const jshintConfig = require('./jshintConfig');
const runSequence = require('run-sequence');
const stripCode = require('gulp-strip-code');

require('./gulp-tasks/gulp-build')(gulp, config);
require('./gulp-tasks/gulp-docs')(gulp, config);
require('./gulp-tasks/gulp-test')(gulp, config);

gulp.task('default', function () {
    var stream = nodemon({
        script: `${config.sourceFolder}/server.js`,
        execMap: {
            js: './node_modules/.bin/babel-node'
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

gulp.task('strip-test-code', function(){
    return gulp.src([`${config.buildFolder}/**/*`])
        .pipe(stripCode({
            start_comment: 'start-test-code',
            end_comment: 'end-test-code'
        }))
        .pipe(gulp.dest(config.buildFolder));
});

gulp.task('build', function (callback) {
    runSequence(
        'build:clean',
        'build:transpile',
        'test:unit-build',
        'strip-test-code',
        (err) => {
            //if any error happened in the previous tasks, exit with a code > 0
            if (err) {
                let exitCode = 2;

                console.error(`Gulp build task failed: "${err.message}"`);
                console.error(`Exiting with code ${exitCode}`);

                return process.exit(exitCode);
            }
            else {
                return callback();
            }
        }
    );
});

gulp.task('test', (callback) => {
    runSequence(
        'test:src',
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
