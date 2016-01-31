var mongoose = require('mongoose');

var subscriberSchema = mongoose.Schema({
    email: {
        type: 'String',
        required: true,
        unique: true
    },
    date: 'Date'
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
