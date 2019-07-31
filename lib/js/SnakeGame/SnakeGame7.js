import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from './Helper/EventHelper';
import Purpose from './Models/Purpose';
import Field from '../Core/Field';

export default class SnakeGame7 extends BaseSnakeGame {
    /**
     *  7. change color snake
     */
    constructor () {
        super({field: new Field('main', {tile: {width: 10, height: 10, indent: 1}, width: 250, height:250, border: true})});

        this._colors = ['yellow', 'red', 'orange', 'blue', 'gray', 'brown', 'bluewhite'];
        this._purposes = [];
        this._purposesCount = 30;
        
        document.addEventListener('keydown', this._handle.bind(this), false);
        document.addEventListener('snake_moving', this._handleSnakeMoving.bind(this), false);
    }
    
    _handle(event) {
        if (event.keyCode === 32) {
            for (let i = 0; i < this._purposesCount; i++) {
                this._addPurpose();
            }
        }
    }
    
    /**
     * @param {Object} event
     */
    _handleSnakeMoving(event) {
        let point = this._snake.decreaseSnake();

        this._field.unlockTile(point);
        this._field.cleanTile(point);

        if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
            this._snake.stop();
        }
        
        let isChange = this._changeSnake(event.p);
        
        if (isChange === true) {
            this._score.set();
            this._addPurpose();
        } else if (isChange === false) {
            this._snake.stop();
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }
    
    _slicePurpose(p) {
        let purpose = null;

        for (let i in this._purposes) {
            if (this._purposes[i].p.x == p.x && this._purposes[i].p.y == p.y) {
                purpose = this._purposes[i];

                this._purposes.splice(i, 1);
                
                break;
            }
        }
        
        return purpose;
    }
    
    _changeSnake(p) {
        let purpose = this._slicePurpose(p);

        if (purpose === null) {
            return null;
        }
        
        if (purpose.color === this._snake.color) {
            return false;
        }
        
        this._snake.color = purpose.color;
        
        for (let i in this._snake.points) {
            this._field.fillTile(this._snake.points[i], purpose.color);
        }
        
        return true;
    }
    
    _addPurpose() {
        let purpose = new Purpose({
            color: this._getRandomColor(),
            p: this._getRandomPoint()
        });

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        this._purposes.push(purpose);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }

    _getRandomColor() {
        return this._colors[parseInt(Math.random() * this._colors.length)];
    }
}