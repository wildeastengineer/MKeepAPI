var notFoundErrorHandler = function (schema) {
    var hooks = [
        // 'count', - is not included here because count query is used in doc ref validation plugin
        'find',
        'findOne',
        'findOneAndRemove',
        'findOneAndUpdate',
        'update'
    ];

    hooks.forEach(function (hook) {
        schema.post(hook, function(doc, next) {
            var error;

            if (doc) {
                return next();
            }

            error = new Error();

            error.name = 'NotFoundError';
            error.message = this.model.modelName + ' was not found!';

            return next(error);
        });
    });
};

module.exports = notFoundErrorHandler;
