'use strict';

const settings = require('./settings.json');
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const score = require('./db/score.js');
const NumberInt = require('mongodb').Int32;
const cors = require('cors');
const io = require('socket.io')(server, { origins: settings.env === 'prod' ? "*:8080" : "*:*"});
const top = io.of('/top');
const send = require('./mailer.js');
const pvp = io.of('/pvp');

if (settings.env === 'prod') {
    var whitelist = [settings.allowed_hosts];
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    };

    app.use(cors(corsOptions));
} else {
    app.use(cors());
}

app.use(bodyParser());

server.listen(8080, '0.0.0.0');
console.log(`Running server: http://0.0.0.0:${8080}`);

app.get('/api/score/:type/:limit', (req, res) => {
    score.top(req.params).then((data) => {
        res.send(data);
    });
});

app.post('/api/score', (req, res) => {
    const data = {
        name: req.body.name === '' ? 'Newbie' : req.body.name.substring(0, 20),
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

app.post('/api/email', (req, res) => {
    const email = req.body.email;
    const message = req.body.message;
 
    if (email && message) {
        send(email, message);
    }
    
    res.send('OK');
});

let rooms = [];

pvp.on("connection", (socket) => {
    let r = rooms.filter(function (room) {
        return room.players.include(socket.id);
    });

    let room = r[0];

    if (!room) {
        room = {players: [socket.id]};
    }

    socket.conn.on("packet", ({ type, data }) => {
        let id = room.players.filter(id=> {return socket.id !== id})[0];
        if (type === 'moveSnake') {
            socket.to(id).emit("movePoint", anotherSocketId, data);
        }

        if (type === 'movePoint') {
            socket.to(id).emit("movePoint", anotherSocketId, data);
            socket.emit("movePoint", socket.id, data);
        }
    });
});