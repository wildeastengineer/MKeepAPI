const _ = require('underscore');

let methodNotAllowedErrorHandler = function(req, res, next) {
    let error;
    let reqMethod;

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
        let allowedMethods = [];

        _.mapObject(req.route.methods, function (val, key) {
            if (val === true) {
                allowedMethods.push(key);
            }
        });

        return allowedMethods;
    }
};

module.exports = methodNotAllowedErrorHandler;
