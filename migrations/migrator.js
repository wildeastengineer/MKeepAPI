var Q = require('q');
var fs =

var migrations = [
    require('./001_initializeGlobalCurrencies')
];

module.exports = {
    run: function () {
        var result = Q();

        migrations.forEach(function (migration) {
            result = result.then(migration);
        });

        return result;
    }
};
