// Libraries
const jasmine = require('gulp-jasmine');
const SpecReporter = require('jasmine-spec-reporter');

module.exports = function (gulp, config) {
    gulp.task('test:all', () => {
        return gulp.src(config.jasmine.getSpecs())
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
    });

    gulp.task('test:unit', () => {
        return gulp.src(config.jasmine.getSpecs({
            level: 'unit'
        }))
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
    });
};
