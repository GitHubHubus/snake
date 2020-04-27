import Snake from './Models/Snake';
import Score from './Score';

/**
 * 0. simple snake
 * 1. clever raccon
 * 2. endless purposes
 * 3. get out of the impasse
 * 4. draw the word
 * 5. fat snake
 * 6. portals as goal
 * 7. change color snake
 */
export default class SnakeGame {
    /**
     * @param {Object} params
     */
    constructor (params) {
        this._field = params.field;
        this._state = null;
        this._createSnake();
        var mock = () => {};
        this._onEndGame = params.onEndGame || mock;
        this._score = new Score();
    }

    score () {
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
    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._field.isLockTile(p)) {
            return this._getRandomPoint();
        }

        return p;
    }
}