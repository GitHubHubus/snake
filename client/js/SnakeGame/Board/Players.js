import i18next from 'i18next';
import Base from "./Base";
import socketConnect from '../../Api/WebSocket';

export default class Players extends Base {
    constructor (params = {}) {
        params.title = i18next.t('page.players.players').toUpperCase();
        super(params);

        this._socket = socketConnect('players');

        this._socket.on('refresh', (data) => {
            this.set(data.count);
        });
    }

    destroy() {
        super.destroy();

        if (this._socket) {
            this._socket.disconnect();
        }
    }
}