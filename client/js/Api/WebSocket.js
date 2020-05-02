import io from 'socket.io-client';
import settings from '../../../settings.json';

const socket = io(`${settings.api.scheme}${settings.api.url}:${settings.api.port}/top`);

export default socket;
