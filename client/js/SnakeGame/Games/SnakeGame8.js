import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import i18next from 'i18next';

export default class SnakeGame8 extends BaseSnakeGame {
    static description () {
        return super.description(SnakeGame8.id());
    }

    static rules() {
        return super.rules(SnakeGame8.id());
    }

    static id() {
        return 8;
    }

    static settings() {
        return super.settings().concat([
            {type: 'number', max:10, min: 1, step: 1, label: i18next.t('games.settings.decrease_time'), key: 'decrease_time'},
            {type: 'number', max:1000, min: 10, step: 10, label: i18next.t('games.settings.decrease_time_point'), key: 'decrease_time_point'},
        ]);
    }

    constructor (params) {
        super(params);

        this._decrease_time = params.settings.decrease_time || 5;
        this._decrease_time_point = params.settings.decrease_time_point || 500;
        this._snakeDecrease = null;
    }

    _stopSnakeDecrease() {
        if (this._snakeDecrease) {
            clearInterval(this._snakeDecrease);
        }
    }

    _startSnakeDecrease() {
        this._snakeDecrease = setInterval(this._snakeDecreaseCallback.bind(this), this._decrease_time * 1000);
    }

    _handle(event) {
        this._addPurpose();

        this._startSnakeDecrease();
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
                this._addPurpose();

                if (this._score.score % this._decrease_time_point === 0) {
                    this._recreateSnakeDecreaseInterval();
                }
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

    _snakeDecreaseCallback() {
        let point = this._snake.decreaseSnake();
        this._field.unlockTile(point);
        this._field.cleanTile(point);

        if (this._snake.length === 0) {
            this.handleEndGame();
        }
    }

    _recreateSnakeDecreaseInterval() {
        if (this._decrease_time > 1) {
            this._decrease_time--;

            this._stopSnakeDecrease();
            this._startSnakeDecrease();
        }
    }

    handleEndGame(isForce = false) {
        this._stopSnakeDecrease();
        super.handleEndGame(isForce);
    }
}
