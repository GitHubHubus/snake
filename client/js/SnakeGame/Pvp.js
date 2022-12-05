import socketConnect from '../Api/WebSocket';

export default class Pvp {
    get roomId () {return this._roomId;}
    set roomId (id) {this._roomId = id;}

    constructor (params) {
        if (params && params.init) {
            this._socket = socketConnect('pvp');
            this._socket.on("movePoint", params.callbackMovePoint);
            this._socket.on("moveSnake", params.callbackMoveSnake);
            this._socket.on("startGame", params.callbackStartGame);
            this._socket.on("connectRoom", params.callbackConnectRoom);
            console.log('INIT pvp', this._socket);
        }
    }

    getId() {
        return this._socket ? this._socket.id : null;
    }

    sendSnake(snake) {
        if (this._socket) {
            console.log('sendSnake:', snake.points);
            this._socket.emit("moveSnake", { snake: snake.points, roomId: this._roomId});
        }
    }

    sendPoint(p) {
        if (this._socket) {
            console.log('sendPoint emit');
            this._socket.emit("movePoint", { point: p, roomId: this._roomId});
        }
    }
}