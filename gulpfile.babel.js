// Libraries
const babel = require('gulp-babel');
const Cache = require('gulp-file-cache');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const dependencies = require('gulp-npm-files');
const jshint = require('gulp-jshint');
const jshintConfig = require('./jshintConfig');
const rimraf = require('rimraf');
const runSequence = require('run-sequence');
const shell = require('gulp-shell');
// Local variables
const buildFolder = 'build';
const cache = new Cache();
const sourceFolder = 'src';
let filesToJsHint;
let foldersToJsDoc;

filesToJsHint = [
    'controllers/*.js',
    'fixtures/*.js',
    'libs/*.js',
    'models/*.js',
    'models/**/*.js',
    'routes/*.js',
    'utils/*.js',
    'utils/**/*.js',
    'gulpfile.babel.js',
    'jshintConfig.js',
    'server.js'
].map(function (file) {
    return `${sourceFolder}/${file}`;
});

foldersToJsDoc = [
    'controllers',
    'models',
    'routes'
].map(function (folder) {
    return `${sourceFolder}/${folder}`;
});

gulp.task('default', function () {
    var stream = nodemon({
        script: `${sourceFolder}/server.js`,
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

/// Start build tasks

gulp.task('build:clean', shell.task([
    `rm -rf ${buildFolder} && mkdir ${buildFolder}`
]));

gulp.task('build:build', () => {
    return gulp.src(`${sourceFolder}/**/*`)
        .pipe(cache.filter()) // remember files
        .pipe(babel()) // here babel takes config from .babelrc
        .pipe(gulp.dest(buildFolder));
});

// Copy dependencies to build/node_modules/
gulp.task('build:copy-dependencies', function() {
    return gulp.src(dependencies(null, './package.json'), {base:'./'})
        .pipe(gulp.dest(buildFolder));
});

gulp.task('build', function (callback) {
    runSequence(
        'build:clean',
        'build:build',
        'build:copy-dependencies',
        'build:start',
        callback
    );
});

gulp.task('build:start', function () {
    nodemon({
        script: `${buildFolder}/server.js`,
        ext: 'js html json',
        env: {'NODE_ENV': 'production' }
    });
});

/// End build tasks

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
