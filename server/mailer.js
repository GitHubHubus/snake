var nodemailer = require('nodemailer');
const settings = require('./settings.json');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    service: settings.mailer.service,
    host: settings.mailer.host,
    port: 465,
    secure: true,
    auth: {
        user: settings.mailer.user,
        pass: settings.mailer.pass
    }
}));

const send = (email, text) => {
    var mailOptions = {
        from: settings.mailer.user,
        to: settings.mailer.supportEmail,
        subject: '[snake] Feedback from ' + email,
        text: text
      };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = send;
