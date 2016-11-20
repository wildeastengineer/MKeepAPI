const root = require('rootrequire');
const config = require(`${root}/${process.env.TEST_SRC}/libs/config`);
const mongoose = require('mongoose');

mongoose.connect(`${config.get('database:uri')}:${config.get('database:port')}/${config.get('database:name')}`,
    (error) => {

        if (error) {
            console.error(error);

            return;
        }

        console.log('Connect to Data Base');
});
