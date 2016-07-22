var errorHandler = function(err, req, res, next) {
    var i;

    var errorTypes = [
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

    for (i = 0; i < errorTypes.length; i++) {
        if (err.name === errorTypes[i].name) {
            res.status(errorTypes[i].status).send(err.message);

            return;
        }
    }

    res.status(500).send('Unhandled error');
};

module.exports = errorHandler;
