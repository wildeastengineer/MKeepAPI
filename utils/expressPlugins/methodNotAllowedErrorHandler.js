var _ = require('underscore');

var methodNotAllowedErrorHandler = function(req, res, next) {
    var error;
    var reqMethod;

    if (!_.has(req, 'route')) {
        next(); //go to notFoundErrorHandler

        return;
    }

    reqMethod = req.method.toLowerCase();

    if (getAllowedMethods().indexOf(reqMethod) === -1) {
        error = new Error();

        error.name = 'MethodNotAllowedError';
        error.message = 'Request method "${reqMethod}" is not allowed for that route'
                .replace('${reqMethod}', reqMethod);

        next(error);
    }

    function getAllowedMethods () {
        var allowedMethods = [];

        _.mapObject(req.route.methods, function (val, key) {
            if (val === true) {
                allowedMethods.push(key);
            }
        });

        return allowedMethods;
    }
};

module.exports = methodNotAllowedErrorHandler;
