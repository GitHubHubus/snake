import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import i18next from 'i18next';

export default class SnakeGame7 extends BaseSnakeGame {
    static description () {
        return super.description(SnakeGame7.id());
    }

    static rules() {
        return super.rules(SnakeGame7.id());
    }

    static id() {
        return 7;
    }

    static settings() {
        return super.settings().concat([
            {'type': 'number', 'max':50, 'min': 5, step: 1, label: i18next.t('games.settings.purposes_count'), key: 'purposes_count'},
            {'type': 'number', 'max':20, 'min': 2, step: 1, label: i18next.t('games.settings.colors_count'), key: 'colors_count'},
        ]);
    }

    constructor (params) {
        super(params);

        this._colors = [
            'yellow', 'red', 'orange', 'blue', 'gray', 'brown', 'green', 'darkslategray', 'chocolate',
            'darkturquoise', 'greenyellow', 'darkred', 'lightcoral', 'darkseagreen', 'palegoldenrod',
            'aqua', 'violet', 'purple', 'slategray', 'darkkhaki'
        ];
        this._purposes = [];
        this._purposesCount = params.settings.purposes_count || 20;
        this._colorCount = params.settings.colors_count || 7;
    }
    
    _handle(event) {
        for (let i = 0; i < this._purposesCount; i++) {
            this._addPurpose();
        }
    }
    
    /**
     * @param {Object} event
     */
    _handleSnakeMoving(event) {
        if (!this._field.isLockTile(event.p)) {
            let point = this._snake.decreaseSnake();

            this._field.unlockTile(point);
            this._field.cleanTile(point); 
        }

        if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
            this.handleEndGame();
        }
        
        let isChange = this._changeSnake(event.p);
        
        if (isChange === true) {
            this.setScore();
            this._addPurpose();
        } else if (isChange === false) {
            this.handleEndGame();
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
        this._snake.unhold();
    }

    _slicePurpose(p) {
        let purpose = null;

        for (let i in this._purposes) {
            if (this._purposes[i].p.x === p.x && this._purposes[i].p.y === p.y) {
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
            p: this.getRandomPoint()
        });

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        this._purposes.push(purpose);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }

    _getRandomColor() {
        return this._colors[parseInt(Math.random() * this._colorCount)];
    }
}