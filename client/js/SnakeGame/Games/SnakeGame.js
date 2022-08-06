import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';

export default class SnakeGame extends BaseSnakeGame {
    static description() {
        return super.description(SnakeGame.id());
    }

    static rules() {
        return super.rules(SnakeGame.id());
    }

    static id() {
        return 1;
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
                this._addPurpose();
            }
        }

        super._handleSnakeMoving(event);
    }

    _addPurpose() {
        let purpose = new Purpose({p: this.getRandomPoint()});

        this._field.fillTile(purpose.p, purpose.color, true);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }
}