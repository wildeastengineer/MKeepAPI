const babel = require('gulp-babel');
const Cache = require('gulp-file-cache');
const dependencies = require('gulp-npm-files');
const nodemon = require('gulp-nodemon');
const shell = require('gulp-shell');
//Local variable
const cache = new Cache();

module.exports = function (gulp, config) {
    gulp.task('build:clean', shell.task([
        `rm -rf ${config.buildFolder} && mkdir ${config.buildFolder}`
    ]));

    gulp.task('build:transpile', () => {
        return gulp.src([`${config.sourceFolder}/**/*`, 'package.json'])
            .pipe(cache.filter()) // remember files
            .pipe(babel()) // here babel takes config from .babelrc
            .pipe(gulp.dest(config.buildFolder));
    });

    // Copy dependencies to build/node_modules/
    gulp.task('build:copy-dependencies', function() {
        return gulp.src(dependencies(null, './package.json'), {base:'./'})
            .pipe(gulp.dest(config.buildFolder));
    });

    gulp.task('build:start', function () {
        nodemon({
            script: `${config.buildFolder}/server.js`,
            ext: 'js html json',
            env: {'NODE_ENV': 'production' }
        });
    });
};
