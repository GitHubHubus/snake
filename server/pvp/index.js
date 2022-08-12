'use strict';

const roomInstance = require('./room');

const initPvp = (pvpSocket) => {
    let rooms = [];

    const _getRoom = (userId, id = null) => {
        let room = rooms[id] || null;

        if (!room) {
            const availableRooms = rooms.filter((r) => {
                return r.countPlayers > r.players.length;
            });

            if (availableRooms.length > 0) {
                for (let i = 0; i < availableRooms.length; i++) {
                    if (availableRooms[0].players.length > 0) {
                        room = availableRooms[0];
                        break;
                    }
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

    pvpSocket.on("connection", (socket) => {
        console.log('ON CONNECT')

        const room = _getRoom(socket.id)
        socket.emit("startGame", room);
        for(let i=0; i < room.players; i++) {
            room.players[i] !== socket.id && socket.to(room.players[i]).emit("startGame", room);
        }

        socket.on("movePoint", (...args) => {
            console.log(args);
            const room = _getRoom(socket.id, args[0].roomId);

            socket.emit("movePoint", args[0].point);

            for(let i=0; i < room.players; i++) {
                room.players[i] !== socket.id && socket.to(room.players[i]).emit("movePoint", args[0].point);
            }

            console.log('EMIT movePoint');
        });

        socket.on("moveSnake", (...args) => {
            console.log(args);
            const room = _getRoom(socket.id, args[0].roomId);

            for(let i=0; i < room.players; i++) {
                room.players[i] !== socket.id && socket.to(room.players[i]).emit("moveSnake", {userId: socket.id, snake: args[0].snake});
            }

            console.log('EMIT moveSnake');
        });
    });
}

exports.initPvp = initPvp;
