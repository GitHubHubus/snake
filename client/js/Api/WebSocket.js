import io from 'socket.io-client';
import settings from '../../settings.json';

const socketConnect = (type) => io(`${settings.api.scheme}${settings.api.url}${settings.api.port ? ':' + settings.api.port : ''}/${type}`);

export default socketConnect;
