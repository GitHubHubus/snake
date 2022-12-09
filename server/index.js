'use strict';

const settings = require('./settings.json');
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('socket.io')(server, { origins: settings.env === 'prod' ? "*:8080" : "*:*"});
const top = io.of('/top');
const players = io.of('/players');
const pvp = io.of('/pvp');
const addRoutes = require('./routing');
const pvpInstance = require('./pvp/index');

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

addRoutes(app, top);
pvpInstance.initPvp(pvp);

players.on("connection", (socket) => {
    players.emit('refresh', { count: io.engine.clientsCount });

    socket.on("disconnect", async () => {
        console.log('RECEIVE disconnect players from ' + socket.id);
        players.emit('refresh', { count: io.engine.clientsCount });
    });
});
