import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import Pvp from "../Pvp";
import TextDrawer from "../../Core/Drawer/TextDrawer";
import {DEFAULT_FIELD_COLOR} from "../../Core/Field";
import {DIRECTION_LEFT} from "../Models/Snake";

//DRAFT
export default class PvpSnakeGame extends BaseSnakeGame {
    static description() {
        return super.description(PvpSnakeGame.id());
    }

    static rules() {
        return super.rules(PvpSnakeGame.id());
    }

    static id() {
        return 11;
    }

    constructor (params) {
        super(params);
        this._startCallback = () => {throw Error('Invalid start callback');};

        this._params = {
            pvp :{
                init: true,
                callbackMovePoint: this._addPurpose.bind(this),
                callbackMoveSnake: this._redrawSnake.bind(this),
                callbackStartGame: this._startGame.bind(this),
                callbackConnectRoom: this._connectRoom.bind(this),
                callbackEndGame: this._endGame.bind(this),
            },
            startParams: params
        };

        this._opponentSnakeDefaultParams = {
            snake: {
                points: this._getOpponentSnakePoints(),
                color: 'yellow',
                direction: DIRECTION_LEFT
            },
            settings: {
                start_speed: 1
            }
        };
    }

    _connectRoom(room) {
        for (let i in room.players) {
            let params = Number(i) === 0 ? this._params.startParams : this._opponentSnakeDefaultParams;

            if (room.players[i] === this._pvp.getId()) {
                this._destroySnake(this._snake);
                this._snake = this._createSnake(params);
            } else {
                if (!params.snake) {
                    params.snake = {};
                }

                params.snake.fixed = true;
                this._destroySnake(this._opponentSnake);
                this._opponentSnake = this._createSnake(params);
            }
        }

        this._pvp.roomId = room.id;
    }

    _startGame(room) {
        this._drawText('WAIT', DEFAULT_FIELD_COLOR);

        if (room.players[0] === this._pvp.getId()) {
            this._createPoint();
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
        } else {
            if (
                this._snake.isSnake(event.p) ||
                this._field.isBorder(event.p) ||
                this._opponentSnake.isSnake(event.p)
            ) {
                this.handleEndGame();
            } else {
                this.setScore();
                this._createPoint();
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
        this._destroySnake(this._opponentSnake);

        this._opponentSnake.points = data.snake || [];

        for (let i = 0; i < this._opponentSnake.points.length; i++) {
            this._field.fillTile(this._opponentSnake.points[i], this._opponentSnake.color, true);
        }
    }

    ready(callback) {
        this._drawText('WAIT', 'red');
        this._pvp = new Pvp(this._params.pvp);

        this._startCallback = callback;
    }

    _getOpponentSnakePoints() {
        const countXField = this._field.countX;
        const countYField = this._field.countY;
        let points = [];

        for (let i=6; i > 1; i--) {
            points.push({x: countXField - i, y: countYField - 1});
        }

        return points;
    }

    _destroySnake(snake) {
        if (!snake || !snake.points) {
            return;
        }

        snake.stop();

        for (let i = 0; i < snake.points.length; i++) {
            this._field.cleanTile(snake.points[i]);
            this._field.unlockTile(snake.points[i]);
        }
    }

    _drawText(text, color = null) {
        const drawer = new TextDrawer({field: this._field});
        const startPoint = this._field.getCenterPoint({x: -8, y: -3});

        drawer.draw(text, startPoint, false, color);
    }

    _createPoint() {
        const point = this.getRandomPoint();
        this._addPurpose(point);
        this._pvp.sendPoint(point);
    }

    _endGame() {
        this._pvp.close();
        super.handleEndGame();
        this._field.cleanAllTiles(true);
        this._drawText('WIN', 'green');
    }

    /**
     * @param isForce
     */
    handleEndGame(isForce = false) {
        super.handleEndGame(true);

        if (!isForce) {
            this._pvp.sendEndGame();
            this._field.cleanAllTiles(true);
            this._drawText('LOSE', 'red');
        }
    }
}