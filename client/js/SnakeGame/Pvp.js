import socketConnect from '../Api/WebSocket';

export default class Pvp {
    constructor (params) {
        if (params && params.init) {
            console.log('INIT pvp');
            this._socket = socketConnect('pvp');
            this._socket.on("movePoint", params.callbackMovePoint);
            this._socket.on("moveSnake", params.callbackMoveSnake);
            this._socket.on("startGame", params.callbackStartGame);
            this._socket.on("connectRoom", params.callbackConnectRoom);
            console.log(this._socket);
        }
    }

    getId() {
        return this._socket ? this._socket.id : null;
    }

    sendSnake(snake) {
        if (this._socket) {
            this._socket.emit("moveSnake", { snake: snake.points});
        }
    }

    sendPoint(p) {
        console.log('sendPoint');
        if (this._socket) {
            console.log('sendPoint emit');
            this._socket.emit("movePoint", { point: p});
        }
    }
}