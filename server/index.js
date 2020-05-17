'use strict';

const settings = require('./settings.json');
const app = require('express')();
let server = null;

if (settings.env === 'dev') {
    server = require('http').Server(app);
} else {
    const fs = require('fs');
    const privateKey  = fs.readFileSync('./sslcert/snake.key', 'utf8');
    const certificate = fs.readFileSync('./sslcert/certificate.crt', 'utf8');
    server = require('https').Server({key: privateKey, cert: certificate}, app);
}

const bodyParser = require('body-parser');
const score = require('./db/score.js');
const NumberInt = require('mongodb').Int32;
const cors = require('cors');
const io = require('socket.io')(server, { origins: "*:8080"});
const top = io.of('/top');
const send = require('./mailer.js');

var whitelist = [settings.allowed_hosts]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.use(bodyParser());

server.listen(8080, '0.0.0.0');
console.log(`Running server: http://0.0.0.0:${8080}`);

app.get('/score/:type/:limit', (req, res) => {
    score.top(req.params).then((data) => {
        res.send(data);
    });
});

app.post('/score', (req, res) => {
    const data = {
        name: req.body.name == '' ? 'Newbie' : req.body.name,
        type: req.body.type,
        score: NumberInt(req.body.score)
    };

    score.post(data).then(() => {
        score.top({type: data.type, limit: 10}).then((result) => {
            top.emit('refresh', { type: data.type, score: result });
            res.send('OK');
        });
    });
});

app.post('/email', (req, res) => {
    const email = req.body.email;
    const message = req.body.message;
 
    if (email && message) {
        send(email, message);
    }
    
    res.send('OK');
});