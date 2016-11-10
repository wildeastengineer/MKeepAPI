/// Libs
let nconf = require('nconf');

nconf.argv()
    .env()
    .file({
        file: './src/config.json'
    });

module.exports = nconf;
