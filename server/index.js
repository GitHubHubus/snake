'use strict';

const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const score = require('./db/score.js');
const NumberInt = require('mongodb').Int32;
const cors = require('cors');
const settings = require('./settings.json');
const io = require('socket.io')(server, { origins: settings.api.allowed_hosts});
const top = io.of('/top');


app.use(cors(settings.api.allowed_hosts));
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