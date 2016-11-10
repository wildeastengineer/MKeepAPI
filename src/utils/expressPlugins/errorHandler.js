/// Libs
const Logger = require('../../libs/log');
/// Local variables
let logger = Logger(module);

let errorHandler = function(err, req, res, next) {
    let errorTypes = [
        {
            name: 'ValidationError',
            status: 400
        },
        {
            name: 'CastError',
            status: 400
        },
        {
            name: 'NotFoundError',
            status: 404
        },
        {
            name: 'MethodNotAllowedError',
            status: 405
        }
    ];

    for (let i = 0; i < errorTypes.length; i++) {
        if (err.name === errorTypes[i].name) {
            res.status(errorTypes[i].status).send(err.message);

            return;
        }
    }

    logger.error(err);
    res.status(500).send('Unhandled error');
};

module.exports = errorHandler;
