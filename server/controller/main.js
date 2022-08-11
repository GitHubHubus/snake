'use strict';

const send = require('../service/mailer.js');

const sendEmail = (req, res) => {
    const email = req.body.email;
    const message = req.body.message;
 
    if (email && message) {
        send(email, message);
    }
    
    res.send('OK');
}

exports.sendEmail = sendEmail;
