'use strict';

const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const score = require('./db/score.js');
const NumberInt = require('mongodb').Int32;
const cors = require('cors');
const io = require('socket.io')(server, { origins: '*:*'});
const top = io.of('/top');
const settings = require('../settings.json');

app.use(cors());
app.use(bodyParser());

server.listen(settings.api.port, settings.api.url);
console.log(`Running server: http://localhost:${settings.api.port}`);

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
        score.top({type: data.type, limit: 10}).then((data) => {
            top.emit('refresh', { type: req.body.type, score: data });
            res.send('OK');
        });
    });
});