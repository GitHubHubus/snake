import Snake from './Models/Snake';
import Score from './Score';

export default class SnakeGame {
    /**
     * @param {Object} params
     */
    constructor (params) {
        this._field = params.field;
        this._createSnake();
        let mock = () => {};
        this._onEndGame = params.onEndGame || mock;
        this._score = new Score();

        this._handle = this._handle.bind(this);
        this._handleSnakeMoving = this._handleSnakeMoving.bind(this);

        document.addEventListener('start', this._handle);
        document.addEventListener('snake_moving', this._handleSnakeMoving);
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
     * @param {Array} points
     */
    _createSnake(points) {
        points = points || null;
        this._snake = new Snake({points: points});
        
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
}