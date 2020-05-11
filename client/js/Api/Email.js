import MainApi from './MainApi';

class Email extends MainApi {
    post(data) {
        return this._post('/email', data);
    }
};

let email = new Email();

export default email;
