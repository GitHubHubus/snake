import i18next from 'i18next';
import Base from "./Base";

export default class Score extends Base {
    constructor (params = {}) {
        params.title = i18next.t('page.score.score').toUpperCase();
        super(params)
    }

    /**
     * @param {Number} amount
     */
    set(amount = 10) {
        this._value += amount;
        this.clean();
        this.redraw();
    }
}