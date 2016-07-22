var _ = require('underscore');

var notFoundErrorHandler = function(req, res, next) {
    var error = new Error();

    error.name = 'NotFoundError';
    error.message = 'Resource is not found by given path "${path}"'.replace('${path}', req.path);

    next(error);
};

module.exports = notFoundErrorHandler;
