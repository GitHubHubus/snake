import {Field} from '../Core/Field';
import TextDrawer from '../Core/Drawer/TextDrawer';
import i18next from 'i18next';

export default class Score {
    get score() { return this._score; }

    constructor () {
        this._field = new Field('score', {tile: {width: 5, height: 5, indent: 1}, width: 240, height: 75});
        this._score = 0;
        this._drawer = new TextDrawer({field: this._field, colors: ['black']});

        this.redraw();
    }

    destroy() {
        this._field.destroy();
    }

    /**
     * @param {Number} amount
     */
    set(amount = 10) {
        this._score += amount;
        this.clean();
        this.redraw();
    }

    redraw() {
        this._drawer.draw(`${i18next.t('page.score.score').toUpperCase()}:`, {x: 1, y: 1});
        this._drawer.draw(this._score.toString(), {x: 1, y: 7});
    }

    clean() {
        this._field.cleanAllTiles();
    }
}