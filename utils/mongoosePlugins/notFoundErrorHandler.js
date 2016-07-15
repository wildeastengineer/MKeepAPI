
var notFoundErrorHandler = function (schema) {
    var hooks = [
        'find',
        'findOne',
        'findOneAndRemove',
        'findOneAndUpdate',
        'update'
    ];

    hooks.forEach(function (hook) {
        schema.post(hook, function(doc, next) {
            var error = new Error();

            error.name = 'NotFoundError';
            error.message = this.model.modelName + ' was not found!';

            if (!doc) {
                return next(error);
            }

            return next();
        });
    });
};

module.exports = notFoundErrorHandler;