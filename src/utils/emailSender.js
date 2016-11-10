/// Libs
const config = require('../libs/config');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Logger = require('../libs/log');
const Q = require('q');

/// Local variables
let emailSender;
let logger = Logger(module);
let passwordRecoveryTemplate;
let path = require('path');
let smtpConfig = {
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
        let deferred = Q.defer();
        let result = {
            success: true,
            message: 'Password recovery token has been successfully generated. ' +
                    'Notification email has been sent to user'
        };
        let transporter = nodemailer.createTransport(smtpConfig);
        let mailOptions = {
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

            if (info.response.indexOf('OK') <= -1) {
                result = {
                    success: false,
                    message: 'Fail to send email to user: ' + userEmail
                };

                deferred.reject(result);

                return;
            }

            logger.debug('Email message sent to {user}: {response}'
                    .replace('{user}', userEmail)
                    .replace('{response}', info.response));
            deferred.resolve(result);
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
    let templateContent;

    templateContent = fs.readFileSync(path.join(__dirname, '/templates/{templateName}.html'
            .replace('{templateName}', templateName)));

    return templateContent.toString();
}

module.exports = emailSender;
