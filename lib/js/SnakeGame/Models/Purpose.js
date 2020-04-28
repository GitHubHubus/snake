export default class Purpose {
    get p () {return this._p;}
    get type () {return this._type;}
    get color () {return this._color;}
    get action () {return this._action;}
    get amount () {return this._amount;}

    /**
     * @param {Object} params
     */
    constructor (params) {
        this._p = params.p;
        this._type = params.type || 'default';
        this._color = params.color || 'red';
        this._action = params.action || function () {};
        this._amount = params.amount || 10;
    }
}
