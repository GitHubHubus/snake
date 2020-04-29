import MainApi from '../MainApi';

class ApiScore extends MainApi {
    list(type, limit) {
        return this._get(`/score/${type}/${limit}`);
    }

    post(data) {
        return this._post('/score', data);
    }
}

let score = new ApiScore();

export default score;
