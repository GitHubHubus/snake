import Snake from './Models/Snake';
import Score from './Score';
import {DEFAULT_TILE_SIZE, Field} from "../Core/Field";

export default class SnakeGame {
    static settings() {
        return [
            {'type': 'number', 'max':1500, 'min': 150, step: 5, label: 'Field width', key: 'field-width'},
            {'type': 'number', 'max':1500, 'min': 150, step: 5, label: 'Field height', key: 'field-height'},
            {'type': 'number', 'max':10, 'min': 0, step: 1, label: 'Start speed', key: 'start-speed'},
            {'type': 'number', 'max':1000, 'min': 10, step: 10, label: 'Increase speed point', key: 'increase-speed-point'},
        ];
    }

    /**
     * @param {Object} params
     */
    constructor (params) {
        this._createField(params);
        this._createSnake(params);

        let mock = () => {};
        this._onEndGame = params.onEndGame || mock;
        this._score = new Score();

        this._handle = this._handle.bind(this);
        this._handleSnakeMoving = this._handleSnakeMoving.bind(this);

        document.addEventListener('start', this._handle);
        document.addEventListener('snake_moving', this._handleSnakeMoving);

        this.increaseSpeedPoint = params.settings['increase-speed-point'] || 0;
    }

    _createField(params) {
        if (params.field) {
            this._field = params.field;
        } else {
            const width = params.settings['field-width'] || 250;
            const height = params.settings['field-height'] || 250;
            this._field = new Field('main', {tile: DEFAULT_TILE_SIZE, width: width, height: height, border: true});
        }
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
        //
    }

    /**
     * @returns {number}
     */
    score() {
        return this._score.score;
    }

    /**
     * @param {Object} params
     */
    _createSnake(params) {
        const points = params.points || null;
        const speed = params.settings['start-speed'] ? (150 - (params.settings['start-speed'] * 10)) : null;

        this._snake = new Snake({points: points, speed: speed});
        
        for (let i in this._snake.points) {
            this._field.fillTile(this._snake.points[i], this._snake.color);
        }
    }

    /**
     * @return {Object} <p>{x;y}</p>
     */
    getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._field.isLockTile(p)) {
            return this.getRandomPoint();
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
}