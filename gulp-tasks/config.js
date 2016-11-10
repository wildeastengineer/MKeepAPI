'use strict';

let config = {
    buildFolder: 'build',
    sourceFolder: 'src',
    filesToJsHint: [
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
    ]
};

config.filesToJsHint = config.filesToJsHint.map((file) => {
    return `${config.sourceFolder}/${file}`;
});

config.foldersToJsDoc = config.foldersToJsDoc.map((folder) => {
    return `${config.sourceFolder}/${folder}`;
});

module.exports = config;
