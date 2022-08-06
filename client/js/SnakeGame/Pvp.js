import socketConnect from '../Api/WebSocket';

export default class Pvp {
    constructor (params) {
        if (params && params.init) {
            this._socket = socketConnect('pvp');
            this._socket.on('refresh', params.refresh);
            this._socket.on('connect', () => {
                'get room or create'
            });
        }
    }

    send(player, point) {
        if (this._socket) {
            this._socket.emit('send move on pvp');
        }
    }
}