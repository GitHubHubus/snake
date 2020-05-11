var nodemailer = require('nodemailer');
const settings = require('./settings.json');

var transporter = nodemailer.createTransport({
  service: settings.mailer.service,
  auth: {
    user: settings.mailer.user,
    pass: settings.mailer.password
  }
});

const send = (email, text) => {
    var mailOptions = {
        from: settings.mailer.user,
        to: settings.mailer.supportEmail,
        subject: 'Response from snake ' + email,
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