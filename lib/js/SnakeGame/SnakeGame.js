import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from './Helper/EventHelper';
import Field from '../Core/Field';
import Purpose from './Models/Purpose';

export default class SnakeGame extends BaseSnakeGame {
    /**
     * 0. simple snake
     */
    constructor () {
        super({field: new Field('main', {tile: {width: 10, height: 10, indent: 1}, width: 150, height:150, border: true})});

        document.addEventListener('start', this._handle.bind(this), false);
        document.addEventListener('snake_moving', this._handleSnakeMoving.bind(this), false);
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
            if (this._snake.isSnake(event.p)) {
                this._snake.stop();
            } else {
                this._addPurpose();
            }
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }

    _addPurpose() {
        let purpose = new Purpose({p: this._getRandomPoint()});

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }
}