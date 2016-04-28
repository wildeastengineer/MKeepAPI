/// Libs
var winston = require('winston');

function getLogger(module) {
    var path;

    // Show file name
    path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'silly',
                label: path
            })
        ]
    });
}

module.exports = getLogger;
