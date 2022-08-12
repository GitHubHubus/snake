import socketConnect from '../Api/WebSocket';

export default class Pvp {
    constructor (params) {
        if (params && params.init) {
            console.log('INIT pvp');
            this._socket = socketConnect('pvp');
            this._socket.on("movePoint", params.callbackMovePoint);
            console.log(this._socket);
        }
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