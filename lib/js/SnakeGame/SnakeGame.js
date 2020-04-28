import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from './Helper/EventHelper';
import {Field, DEFAULT_TILE_SIZE} from '../Core/Field';
import Purpose from './Models/Purpose';

export default class SnakeGame extends BaseSnakeGame {
    /**
     * 0. simple snake
     */
    constructor (params) {
        params.field = new Field('main', {tile: DEFAULT_TILE_SIZE, width: 150, height:150, border: true});
        super(params);
    }

    /**
     * @param {Object} event
     */
    _handle(event) {
        this._addPurpose();
    }

    /**
     * @param {Object} event
     */
    _handleSnakeMoving(event) {
        if (!this._field.isLockTile(event.p)) {
            let point = this._snake.decreaseSnake();
            this._field.unlockTile(point);
            this._field.cleanTile(point);
        } else {
            if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
                this.handleEndGame();
            } else {
                this._score.set();
                this._addPurpose();
            }
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }

    _addPurpose() {
        let purpose = new Purpose({p: this.getRandomPoint()});

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }
}