import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import Pvp from "../Pvp";
import TextDrawer from "../../Core/Drawer/TextDrawer";
import {DEFAULT_FIELD_COLOR} from "../../Core/Field";
import {DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP} from "../Models/Snake";
import Players from "../Board/Players";
import i18next from 'i18next';

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

    static settings() {
        return [
            {type: 'select', choices: [2, 3, 4], default: 2, label: i18next.t('games.settings.count_players'), key: 'count_players'}
        ];
    }

    constructor (params) {
        params.board = new Players();
        super(params);
        this._startCallback = () => {throw Error('Invalid start callback');};

        this._params = {
            pvp :{
                init: true,
                countPlayers: params.settings.count_players || 2,
                callbackMovePoint: this._addPurpose.bind(this),
                callbackMoveSnake: this._redrawSnake.bind(this),
                callbackStartGame: this._startGame.bind(this),
                callbackReadyGame: this._readyGame.bind(this),
                callbackConnectRoom: this._connectRoom.bind(this),
                callbackEndGame: this._endGame.bind(this),
            }
        };

        this._opponentSnakes = {};

        this._defaultSnakeParams = [
            this._getSnakeParams(0, 'green', DIRECTION_RIGHT),
            this._getSnakeParams(1, 'yellow', DIRECTION_LEFT),
            this._getSnakeParams(2, 'blue', DIRECTION_DOWN),
            this._getSnakeParams(3, 'orange', DIRECTION_UP),
        ];
    }

    _connectRoom(room) {
        for (let i in room.players) {
            let params = this._defaultSnakeParams[i];

            if (room.players[i] === this._pvp.getId()) {
                this._destroySnake(this._snake);
                this._snake = this._createSnake(params);
            } else {
                if (!params.snake) {
                    params.snake = {};
                }

                params.snake.fixed = true;
                let opponentSnake = this._opponentSnakes[room.players[i]];
                if (opponentSnake) {
                    this._destroySnake(opponentSnake);
                }

                this._opponentSnakes[room.players[i]] = this._createSnake(params);
            }
        }

        this._pvp.roomId = room.id;
        this._drawText('WAIT', this._snake.color);
    }

    _startGame(room) {
        this._drawText('READY', DEFAULT_FIELD_COLOR, -10);
        this._field.fillTile({x: this._field.countX, y: 8}, 'black', true);
        if (room.players[0] === this._pvp.getId()) {
            this._createPoint();
        }
    }

    _readyGame(room) {
        this._drawText('WAIT', DEFAULT_FIELD_COLOR);
        this._drawText('READY', this._snake.color, -10);
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
                this._isOpponentSnake(event.p)
            ) {
                this.handleEndGame();
            } else {
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
        if (!this._opponentSnakes[data.userId]) {
            return;
        }

        this._destroySnake(this._opponentSnakes[data.userId]);

        this._opponentSnakes[data.userId].points = data.snake || [];

        for (let i = 0; i < this._opponentSnakes[data.userId].points.length; i++) {
            this._field.fillTile(this._opponentSnakes[data.userId].points[i], this._opponentSnakes[data.userId].color, true);
        }
    }

    ready(callback) {
        this._pvp = new Pvp(this._params.pvp);
        this._pvp.sendConnectRoom();

        this._startCallback = callback;
    }

    _getOpponentSnakePoints(direction) {
        const countXField = this._field.countX;
        const countYField = this._field.countY;
        let points = [];

        switch (direction) {
            case DIRECTION_LEFT:
                for (let i=5; i > 0; i--) {
                    points.push({x: countXField - i, y: countYField - 1});
                }
                break;
            case DIRECTION_DOWN:
                for (let i=6; i > 0; i--) {
                    points.push({x: countXField - 1, y: i});
                }
                break;
            case DIRECTION_UP:
                for (let i=5; i > 0; i--) {
                    points.push({x: 1, y: countYField - i});
                }
                break;
            case DIRECTION_RIGHT:
            default:
                for (let i=6; i > 0; i--) {
                    points.push({x: i, y: 1});
                }
                break;

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

    _drawText(text, color = null, x = -8) {
        const drawer = new TextDrawer({field: this._field});
        const startPoint = this._field.getCenterPoint({x: x, y: -3});

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
        super.handleEndGame();

        if (this._pvp) {
            this._pvp.sendEndGame();
        }

        if (!isForce) {
            this._field.cleanAllTiles(true);
            this._drawText('LOSE', 'red');
        }
    }

    _getSnakeParams(index, color, direction) {
        return {
            snake: {
                points: this._getOpponentSnakePoints(direction),
                    color: color,
                    direction: direction
            },
            settings: {
                start_speed: 1
            }
        }
    }

    _isOpponentSnake(p) {
        let is = false;
        for (const [key, snake] of Object.entries(this._opponentSnakes)) {
            if (snake.isSnake(p)) {
                is = true;
                break;
            }
        }

        return is;
    }
}