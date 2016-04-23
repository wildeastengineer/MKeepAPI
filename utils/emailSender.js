var nodemailer = require('nodemailer');
var Q = require('q');

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'money.keeper.service@gmail.com',
        pass: 'moneyKeeper123456'
    }
};

var emailSender = {
    passwordRecovery: function (userEmail, url) {
        var deferred = Q.defer();
        var transporter = nodemailer.createTransport(smtpConfig);

        var mailOptions = {
            from: {
                name: 'MKeeper Service',
                address: smtpConfig.auth.user
            },
            to: userEmail,
            subject: 'Password recovery for you MKeeper account', // Subject line
            text: url, // plaintext body
            html: '<b>'+ url + '</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                deferred.reject(error);
            }

            console.log('Message sent: ' + info.response);

            deferred.resolve(info);
        });

        return deferred.promise;
    }
};

module.exports = emailSender;