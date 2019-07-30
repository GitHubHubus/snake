import Field from '../Core/Field';
import TextDrawer from '../Core/Drawer/TextDrawer';

export default class Score {
    constructor () {
        this._field = new Field('score', {tile: {width: 5, height: 5, indent: 1}, width: 240, height: 80});
        this._score = 0;
        this._drawer = new TextDrawer({field: this._field, colors: ['black']});

        this.set();
    }
    
    set(purpose) {
        //if (purpose) {
            this._score += 10;
        //}

        this.clean();
        this._drawer.draw('SCORE:', {x: 1, y: 0});
        this._drawer.draw(this._score.toString(), {x: 1, y: 7});
    }
    
    clean() {
        this._field.cleanAllTiles();
    }
}