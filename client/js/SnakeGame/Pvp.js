import socketConnect from '../Api/WebSocket';

export default class Pvp {
    constructor (params) {
        if (params && params.init) {
            this._socket = socketConnect('pvp');
           // this._socket.on('refresh', params.refresh);
            this._socket.on('connect', () => {
                'get room or create'
            });
            this._socket.on("packet", params.callback);
        }
    }

    sendSnake(snake) {
        if (this._socket) {
            this._socket.emit("moveSnake", { snake: snake.points});
        }
    }

    sendPoint(p) {
        if (this._socket) {
            this._socket.emit("movePoint", { point: p});
        }
    }
}