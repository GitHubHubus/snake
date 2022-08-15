import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import Pvp from "../Pvp";
import {DIRECTION_RIGHT} from "../Models/Snake";
import TextDrawer from "../../Core/Drawer/TextDrawer";
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
        this._startCallback = () => {throw Error('Invalid start callback');};
        this._params = {pvp :{
            init: true,
            callbackMovePoint: this._addPurpose.bind(this),
            callbackMoveSnake: this._redrawSnake.bind(this),
            callbackStartGame: this._startGame.bind(this),
        }};

        let snakeParams = {
            snake: this._getOpponentSnakePoints(),
            color: 'yellow',
            settings: {
                start_speed: 1
            },
            fixed: true
        };
        this._opponentSnake = this._createSnake(snakeParams);
        this._pvp = new Pvp(this._params.pvp);
    }

    /**
     * @param {Object} event
     */
    _handle(event) {
        //this._pvp = new Pvp(this._params.pvp);
    }

    _startGame(room) {
        if (room.players[0].id === this._pvp.getId()) {
            this._pvp.sendPoint(this.getRandomPoint());
        } else {
            this._opponentSnake.points = this._snake.points;
            this._opponentSnake.direction = DIRECTION_RIGHT;
            this._opponentSnake.color = 'green';

            this._snake.points = this._getOpponentSnakePoints();
            this._snake.direction = 0;
            this._snake.color = 'yellow';
        }

        this._go();
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
        this._pvp.sendSnake(this._snake);
    }

    _addPurpose(point) {
        let purpose = new Purpose({p: point});

        this._field.fillTile(purpose.p, purpose.color, true);

        EventHelper.fire('add_purpose', {purpose: purpose});
    }

    _redrawSnake(data) {
        for (let i = 0; i < this._opponentSnake.points.length; i++) {
            this._field.cleanTile(this._opponentSnake.points[i]);
        }

        this._opponentSnake.points = data.points;

        for (let i = 0; i < this._opponentSnake.points.length; i++) {
            this._field.fillTile(this._opponentSnake.points[i], this._opponentSnake.color, true);
        }
    }

    ready(callback) {
        const drawer = new TextDrawer({field: this._field});
        const startPoint = this._field.getCenterPoint({x: -2, y: -3});

        drawer.draw('W', startPoint, false, this._field.color);

        this._startCallback = callback;
        console.log('READY');
    }

    _go() {
        let i = 4;
        const drawer = new TextDrawer({field: this._field});
        let interval = setInterval(() => {
            let startPoint = this._field.getCenterPoint({x: -2, y: -3});
            drawer.draw(String(i--), startPoint, false, this._field.color);

            if (i === 0) {
                clearInterval(interval);
                this._startCallback();
                return;
            }

            drawer.draw(String(i), startPoint, false, '#007bff');
        }, 400);
    }

    _getOpponentSnakePoints() {
        const countXField = this._field.countX;
        const countYField = this._field.countY;
        let points = [];

        for (let i=1; i < 6; i++) {
            points.push({x: countXField - i, y: countYField - 1});
        }

        return points;
    }
}