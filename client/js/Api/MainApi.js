import axios from 'axios';
import settings from '../../settings.json';

const queryString = require('query-string');

class MainApi {
    constructor () {
        this._url = `${settings.api.scheme}${settings.api.url}${settings.api.port ? ':' + settings.api.port : ''}/api`;
    }
    
    _get(url) {
        return axios.get(this._url + url).catch(this._handleError);
    }

     _post(url, data) {
        return axios.post(this._url + url, queryString.stringify(data)).catch(this._handleError);
    }

    _put(url, data) {
        return axios.put(this._url + url, queryString.stringify(data)).catch(this._handleError);
    }

    _delete(url) {
        return axios.delete(this._url + url).catch(this._handleError);
    }

    _handleError(e) {
        return e.response;
    }
}

export default MainApi;
