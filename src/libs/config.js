"use strict";

/// Libs
let nconf = require('nconf');

nconf.argv()
    .env()
    .file({
        file: 'config.json',
        dir: __dirname,
        search: true
    });

module.exports = nconf;
