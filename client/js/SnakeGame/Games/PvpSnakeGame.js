import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import Pvp from "../Pvp";
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
        super(params);
        this._params = {pvp :{
            init: true,
            callbackMovePoint: this._addPurpose.bind(this)
        }};
    }

    /**
     * @param {Object} event
     */
    _handle(event) {
        this._pvp = new Pvp(this._params.pvp);
        this._pvp.sendPoint(this.getRandomPoint());
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