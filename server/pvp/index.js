'use strict';

const roomInstance = require('./room');

const initPvp = (pvpSocket) => {
    let rooms = [];
    let countPlayers = 0;

    const _getRoom = (userId, id = null) => {
        let room = rooms[id] || null;

        if (!room) {
            let keys = Object.keys(rooms);

            for (let i = 0; i < keys.length; i++) {
                if (rooms[keys[i]].players.length < rooms[keys[i]].countPlayers) {
                    room = rooms[keys[i]];
                    break;
                }
            }

            if (!room) {
                room = roomInstance.create(Date.now());
                rooms[room.id] = room;
            }

            room.players.push(userId)
        }

        return room;
    }

    const _removePlayerFromRoom = (userId) => {
        let keys = Object.keys(rooms);

        for (let i = 0; i < keys.length; i++) {
            const index = rooms[keys[i]].players.indexOf(userId);

            if (index !== -1) {
                rooms[keys[i]].players.splice(index, 1);

                if (rooms[keys[i]].length === 0) {
                    delete rooms[keys[i]];
                }
            }
        }
    }

    pvpSocket.on("connection", (socket) => {
        const room = _getRoom(socket.id);

        for(let i=0; i < room.players.length; i++) {
            pvpSocket.to(room.players[i]).emit("connectRoom", room);
            console.log('EMIT connectRoom to ' + room.players[i], room);
        }

        if (room.players.length === room.countPlayers) {
            for(let i=0; i < room.players.length; i++) {
                pvpSocket.to(room.players[i]).emit("startGame", room);
                console.log('EMIT startGame to ' + room.players[i], room);
            }
        }

        socket.on("disconnect", async () => {
            _removePlayerFromRoom(socket.id);
        });

        socket.on("movePoint", (...args) => {
            console.log("RECEIVE movePoint from " + socket.id, args);
            const room = _getRoom(socket.id, args[0].roomId);

            for(let i=0; i < room.players.length; i++) {
                if (room.players[i] !== socket.id) {
                    pvpSocket.to(room.players[i]).emit("movePoint", args[0].point);
                    console.log('EMIT movePoint to ' + room.players[i]);
                }
            }
        });

        socket.on("moveSnake", (...args) => {
            console.log("RECEIVE moveSnake from " + socket.id, args[0].snake);
            const room = _getRoom(socket.id, args[0].roomId);

            for(let i=0; i < room.players.length; i++) {
                if (room.players[i] !== socket.id) {
                    pvpSocket.to(room.players[i]).emit("moveSnake", {userId: socket.id, snake: args[0].snake});
                    console.log('EMIT moveSnake to ' + room.players[i]);
                }
            }
        });

        socket.on("endGame", (...args) => {
            console.log("RECEIVE endGame from " + socket.id);
            const room = _getRoom(socket.id, args[0].roomId);

            for(let i=0; i < room.players.length; i++) {
                if (room.players[i] !== socket.id) {
                    pvpSocket.to(room.players[i]).emit("endGame", {userId: socket.id});
                    console.log('EMIT endGame to ' + room.players[i]);
                }
            }
        });
    });
}

exports.initPvp = initPvp;
