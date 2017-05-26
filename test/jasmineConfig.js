'use strict';

let jasmineConfig = {
    spec_dir: 'test',
    helpers: [
        'helpers/**/*.js'
    ],
    stopSpecOnExpectationFailure: false,
    random: false,

    /**
     * Get specs paths depending on given type and level of tests
     *
     * @function
     * @name getSpecs
     * @params {Object} [suite]
     * @params {string} [suite.level]
     * @params {string} [suite.type]
     *
     * @returns {string[]}
     */
    getSpecs (suite) {
        suite = suite || {};
        suite.level = suite.level || '';
        suite.type = suite.type || '';

        let dir = `${this.spec_dir}/spec/${suite.level}/**/${suite.type}/`;

        if (process.env.TEST_SPECS) {
            return process.env.TEST_SPECS.split(',').map((spec) => {
                spec = spec.indexOf('Spec') !== -1 ? spec : spec + 'Spec';
                spec = spec.indexOf('.js') !== -1 ? spec : spec + '.js';

                return `${dir}${spec}`;
            });
        }

        return [`${dir}*.js`];
    }
};

module.exports = jasmineConfig;
