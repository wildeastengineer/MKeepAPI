const root = require('rootrequire');
const config = require(`${root}/${process.env.TEST_SRC}/libs/config`);
const mongoose = require('mongoose');

require('jasmine-expect');

const env = process.env.NODE_ENV || 'dev';
const databaseUri = config.get(`database:${env}:uri`);
const databasePort = config.get(`database:${env}:port`);
const databaseName = config.get(`database:${env}:name`);
const databaseUrl = `${databaseUri}:${databasePort}/${databaseName}`;

mongoose.connect(databaseUrl,
    (error) => {

        if (error) {
            console.error(error);

            return;
        }

        console.log('Connect to Data Base');
});
