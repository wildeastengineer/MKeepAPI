module.exports = {
    'googleAuth': {
        'dev': {
            'clientID': '479242742399-ueh2r60pp9fhole8k64gvieemlt45rig.apps.googleusercontent.com',
            'clientSecret': 'jIntfIjDwP6oa9Ga-UCqwzNd',
            'callbackURL': 'http://localhost:8080/auth/google/callback'
        },
        'prod': {
            'clientID': '479242742399-79kkmfcijr2l32ak77tnqd9gn814is96.apps.googleusercontent.com',
            'clientSecret': '2PM3ZSFNAN5scPgQ6RH56aeH',
            'callbackURL': 'http://mkeep.me/auth/google/callback'
        }
    },
    'vkAuth': {
        'dev': {
            'clientID': '5032569',
            'clientSecret': 'kfdBECuRjxav8aoeWQNc',
            'callbackURL': 'http://localhost:8080/auth/vk/callback'
        },
        'prod': {
            'clientID': '5032533',
            'clientSecret': 'hXh8EqlOnXjo0DgKYA9F',
            'callbackURL': 'http://mkeep.me/auth/vk/callback'
        }
    },
    'facebookAuth': {
        'dev': {
            'clientID': '918792748176360',
            'clientSecret': '9882d320370fe3e065171366be2feb3f',
            'callbackURL': 'http://localhost:8080/auth/facebook/callback'
        },
        'prod': {
            'clientID': '918791511509817',
            'clientSecret': '403523e6b57218a8dafe5bc99a6ab256',
            'callbackURL': 'http://mkeep.me/auth/facebook/callback'
        }
    }
};
