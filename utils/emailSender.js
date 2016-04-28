/// Libs
var config = require('../libs/config');
var fs = require('fs');
var nodemailer = require('nodemailer');
var Logger = require('../libs/log');
var Q = require('q');

/// Local variables
var emailSender;
var logger = Logger(module);
var passwordRecoveryTemplate;
var path = require('path');
var smtpConfig = {
    host: config.get('emailSender:host'),
    port: config.get('emailSender:port'),
    secure: config.get('emailSender:secure'), // use SSL
    auth: {
        user: config.get('emailSender:auth:user'),
        pass: config.get('emailSender:auth:pass')
    }
};

/// Reading html templates
passwordRecoveryTemplate = readTemplate('passwordRecovery');

emailSender = {
    /**
     * Send an email to given user sending link with password recovery url
     *
     * @param {string} userEmail
     * @param {string} url
     *
     * @returns {promise}
     */
    passwordRecovery: function (userEmail, url) {
        var deferred = Q.defer();
        var transporter = nodemailer.createTransport(smtpConfig);

        var mailOptions = {
            from: {
                name: 'MKeeper Service',
                address: smtpConfig.auth.user
            },
            to: userEmail,
            subject: 'Password recovery for your MKeeper account', // Subject line
            html: passwordRecoveryTemplate
                    .replace('{username}', userEmail)
                    .replace('{link}', url)
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                logger.error(error);
                deferred.reject(error);
            }

            logger.debug('Email message sent to {user}: {response}'
                    .replace('{user}', userEmail)
                    .replace('{response}', info.response));
            deferred.resolve(info.response);
        });

        return deferred.promise;
    }
};

/**
 * @privet
 * Read content of given file name
 *
 * @param {string} templateName
 *
 * @returns {string}
 */
function readTemplate (templateName) {
    var templateContent;

    templateContent = fs.readFileSync(path.join(__dirname, '/templates/{templateName}.html'
            .replace('{templateName}', templateName)));

    return templateContent.toString();
}

module.exports = emailSender;
