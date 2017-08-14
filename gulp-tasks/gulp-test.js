// Libraries
const jasmine = require('gulp-jasmine');
const mongoose = require('mongoose');
const SpecReporter = require('jasmine-spec-reporter');

function disconnectFromDb () {
    mongoose.connection.close(() => {
        console.log('Disconnect from Data Base')
    });
}

module.exports = function (gulp, config) {
    gulp.task('test:all', () => {
        return gulp.src(config.jasmine.getSpecs())
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
            .on('end', () => {
                disconnectFromDb();
            })
            .on('error', () => {
                disconnectFromDb();
            });
    });

    gulp.task('test:unit', () => {
        return gulp.src(config.jasmine.getSpecs({
            level: 'unit'
        }))
            .pipe(jasmine({
                config: config.jasmine,
                reporter: new SpecReporter()
            }))
            .on('end', () => {
                disconnectFromDb();
            })
            .on('error', () => {
                disconnectFromDb();
            });
    });
};
