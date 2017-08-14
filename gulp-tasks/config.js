const jasmineConfig = require('../test/jasmineConfig');

let config = {
    sourceFolder: 'src',
    filesToTest: [
        'controllers/*.js',
        'fixtures/*.js',
        'libs/*.js',
        'models/*.js',
        'models/**/*.js',
        'routes/*.js',
        'utils/*.js',
        'utils/**/*.js',
        'gulpfile.babel.js',
        'jshintConfig.js',
        'server.js'
    ],
    foldersToJsDoc: [
        'controllers',
        'models',
        'routes'
    ],
    jasmine: jasmineConfig
};

config.filesToJsHint = config.filesToTest.map((file) => {
    return `${config.sourceFolder}/${file}`;
});

config.foldersToJsDoc = config.foldersToJsDoc.map((folder) => {
    return `${config.sourceFolder}/${folder}`;
});

module.exports = config;
