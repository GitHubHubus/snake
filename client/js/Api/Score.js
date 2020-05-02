import MainApi from './MainApi';

class Score extends MainApi {
    async list(type, limit) {
        return await this._get(`/score/${type}/${limit}`);
    }

    post(data) {
        return this._post('/score', data);
    }
}

let score = new Score();

export default score;
