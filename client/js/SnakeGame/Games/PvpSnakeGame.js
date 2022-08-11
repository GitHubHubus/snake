import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
//DRAFT
export default class PvpSnakeGame extends BaseSnakeGame {
    static description() {
        return super.description(PvpSnakeGame.id());
    }

    static rules() {
        return 'No rules';
    }

    static id() {
        return 11;
    }

    constructor (params) {
        params.pvp = {
            init: true,
            callback: (type, data) => {
                if (type === 'moveSnake') {
                    this.redrawPlayerSnake(data);
                }

                if (type === 'movePoint') {
                    this._addPurpose(data);
                }
            }
        }

        super(params);
        let snakeParams = {
            snake: [{x: 20, y: 20}, {x: 19, y: 20}, {x: 18, y: 20}, {x: 17, y: 20}, {x: 16, y: 20}],
            color: 'yellow',
            settings: {
                start_speed: 1
            }
        };
        this._playerSnake = this._createSnake(snakeParams);
    }

    redrawPlayerSnake(points) {
        this._playerSnake.points.forEach((point) => {
            this._field.unlockTile(point);
        })

        this._playerSnake.points = points;
        this._playerSnake.points.forEach((point) => {
            this._field.fillTile(point, this._playerSnake.color, true);
        })
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
                this.setScore();
                this._pvp.sendPoint(this.getRandomPoint());
            }
        }

        super._handleSnakeMoving(event);
    }

    _addPurpose(point) {
        let purpose = new Purpose({p: point});

        this._field.fillTile(purpose.p, purpose.color, true);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }
}