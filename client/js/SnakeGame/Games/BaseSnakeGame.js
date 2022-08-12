import Snake from '../Models/Snake';
import Score from '../Score';
import {DEFAULT_TILE_SIZE, Field} from "../../Core/Field";
import i18next from 'i18next';
import TextDrawer from "../../Core/Drawer/TextDrawer";

export default class SnakeGame {
    static description(id) {
        return i18next.t(`games.description.${id}`);
    }

    static rules(id) {
        return  i18next.t(`games.rules.${id}`);
    }

    static settings() {
        return [
            {'type': 'number', 'max':1000, 'min': 150, step: 10, label: i18next.t('games.settings.field_width'), key: 'field_width'},
            {'type': 'number', 'max':1000, 'min': 150, step: 10, label: i18next.t('games.settings.field_height'), key: 'field_height'},
            {'type': 'number', 'max':10, 'min': 0, step: 1, label: i18next.t('games.settings.start_speed'), key: 'start_speed'},
            {'type': 'number', 'max':1000, 'min': 10, step: 10, label: i18next.t('games.settings.increase_speed_point'), key: 'increase_speed_point'},
        ];
    }

    /**
     * @param {Object} params
     */
    constructor (params) {
        this._createField(params);
        this._snake = this._createSnake(params);

        let mock = () => {};
        this._onEndGame = params.onEndGame || mock;
        this._score = new Score();

        this._handle = this._handle.bind(this);
        this._handleSnakeMoving = this._handleSnakeMoving.bind(this);

        document.addEventListener('start', this._handle);
        document.addEventListener('snake_moving', this._handleSnakeMoving);

        this.increaseSpeedPoint = params.settings.increase_speed_point || 0;
    }

    _createField(params) {
        if (params.field) {
            this._field = params.field;
        } else {
            const width = params.settings.field_width || 250;
            const height = params.settings.field_height || 250;
            this._field = new Field('main', {tile: DEFAULT_TILE_SIZE, width: width, height: height, border: true});
        }
    }

    /**
     * Should be overriden in child class
     */
    static id() {
        //
    }

    /**
     * @param {Object} event
     */
    _handle(event) {
        //
    }

    /**
     * @param {Object} event
     */
    _handleSnakeMoving(event) {
        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color, true);
        this._snake.unhold();
    }

    /**
     * @returns {number}
     */
    score() {
        return this._score.score;
    }

    /**
     * @param {Object} params
     * @return {Snake}
     */
    _createSnake(params) {
        const points = params.snake && params.snake.points ? params.snake.points : null;
        const speed = params.settings.start_speed ? (150 - (params.settings.start_speed * 10)) : null;

        let snake = new Snake({points: points, speed: speed});
        
        for (let i in snake.points) {
            this._field.fillTile(snake.points[i], snake.color, true);
        }

        return snake;
    }

    /**
     * @return {Object} <p>{x;y}</p>
     */
    getRandomPoint(nested = 300) {
        let p = this._field.getRandomPoint();

        if (this._field.isLockTile(p)) {
            let decreasedNested = nested - 1;

            if (decreasedNested === 0) {
                console.log('break game');
                this.handleEndGame();
            }

            return this.getRandomPoint(decreasedNested);
        }

        return p;
    }

    forceEndGame() {
        this.handleEndGame(true);
    }

    destroyView() {
        this._field.destroy();
        this._score.destroy();
    }

    /**
     * It could be overridden in child class, but this method required be called with 'super'
     * @param isForce
     * @private
     */
    handleEndGame(isForce = false) {
        this._snake.stop();
        document.removeEventListener('start', this._handle);
        document.removeEventListener('snake_moving', this._handleSnakeMoving);
        !isForce && this._onEndGame();
    }

    setScore(amount) {
        if (this.increaseSpeedPoint && (this._score.score % this.increaseSpeedPoint === 0)) {
            this._snake.changeInterval(-10);
        }

        this._score.set(amount);
    }

    ready(callback) {
        let i = 4;
        const drawer = new TextDrawer({field: this._field});
        let interval = setInterval(() => {
            let startPoint = this._field.getCenterPoint({x: -2, y: -3});
            drawer.draw(String(i--), startPoint, false, this._field.color);

            if (i === 0) {
                clearInterval(interval);
                callback();
                return;
            }

            drawer.draw(String(i), startPoint, false, '#007bff');
        }, 400);
    }
}