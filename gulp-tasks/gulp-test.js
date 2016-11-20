// Libraries
const jasmine = require('gulp-jasmine');
const SpecReporter = require('jasmine-spec-reporter');

module.exports = function (gulp, config) {
    gulp.task('test:all-src', () => {
        process.env.TEST_SRC = config.sourceFolder;

        return gulp.src(config.jasmine.getSpecs())
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
    });

    gulp.task('test:unit-build', () => {
        process.env.TEST_SRC = config.buildFolder;

        return gulp.src(config.jasmine.getSpecs({
            level: 'unit'
        }))
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
    });
};
