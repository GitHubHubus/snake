import {Field} from '../../Core/Field';
import TextDrawer from '../../Core/Drawer/TextDrawer';
import i18next from 'i18next';

export default class Base {
    get value() { return this._value; }

    constructor (params = {}) {
        this._title = params.title || '';
        this._field = new Field('scoreboard', {tile: {width: 5, height: 5, indent: 1}, width: 240, height: 75});
        this._value = 0;
        this._drawer = new TextDrawer({field: this._field, colors: ['black']});

        this.redraw();
    }

    destroy() {
        this._field.destroy();
    }

    /**
     * @param {Number} value
     */
    set(value) {
        this._value = value;
        this.clean();
        this.redraw();
    }

    redraw() {
        this._drawer.draw(`${this._title}:`, {x: 1, y: 1});
        this._drawer.draw(this._value.toString(), {x: 1, y: 7});
    }

    clean() {
        this._field.cleanAllTiles();
    }
}