import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import i18next from 'i18next';

export default class SnakeGame3 extends BaseSnakeGame {
    static description () {
        return super.description(SnakeGame3.id());
    }

    static rules() {
        return super.rules(SnakeGame3.id());
    }

    static id() {
        return 3;
    }

    static settings() {
        return super.settings().concat([
            {type: 'number', max:10, min: 1, step: 1, label: i18next.t('games.settings.disappearance_time'), key: 'disappearance_time'},
        ]);
    }

    constructor (params) {
        super(params);

        this._disappearance_time = params.settings.disappearance_time || 5;
        this._counter = this._disappearance_time;
        this._colors = ['#ffd7d9', '#ffa3ac', '#ff949e', '#ff6b79', '#ff394c', '#ff1325', '#ff000e', '#eb0009', '#bc0008', '#b80007'];
        this._purpose = null;
    }

    _stopDisappearancePurpose() {
        if (this._purpose) {
            this._purpose = null;
            this._counter = this._disappearance_time;
            clearInterval(this._purposeDisappearance);
        }
    }

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
                this._addPurpose();
            }
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
        this._snake.unhold();
    }

    _addPurpose() {
        this._stopDisappearancePurpose();

        this._purpose = new Purpose({p: this.getRandomPoint()});
        this._purposeDisappearance = setInterval(this._purposeDisappearanceCallback.bind(this), 1000);

        this._field.fillTile(this._purpose.p, this._colors[--this._counter]);
        this._field.lockTile(this._purpose.p);

        EventHelper.fire('add_purpose', {purpose: this._purpose});
    }

    _purposeDisappearanceCallback() {
        if (this._counter === 0) {
            this._field.unlockTile(this._purpose.p);
            this._field.cleanTile(this._purpose.p);
            this._addPurpose();
        } else {
            this._field.fillTile(this._purpose.p, this._colors[--this._counter]);
        }
    }

    handleEndGame(isForce = false) {
        this._stopDisappearancePurpose();
        super.handleEndGame(isForce);
    }
}
