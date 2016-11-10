// Libraries
const jasmine = require('gulp-jasmine');
const SpecReporter = require('jasmine-spec-reporter');

module.exports = function (gulp, config) {
    gulp.task('test:all', () => {
        gulp.src(config.jasmine.getSpecs())
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
    });

    gulp.task('test:public', () => {
        gulp.src(config.jasmine.getSpecs({
            type: 'public'
        }))
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
    });

    gulp.task('test:unit-public', () => {
        gulp.src(config.jasmine.getSpecs({
            type: 'public',
            level: 'unit'
        }))
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
    });
}