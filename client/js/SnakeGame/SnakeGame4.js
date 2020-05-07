import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from './Helper/EventHelper';
import ShapeDrawer from '../Core/Drawer/ShapeDrawer';
import i18next from 'i18next';

export default class SnakeGame4 extends BaseSnakeGame {
    static description () {
        return i18next.t('games.description.4');
    }

    static rules() {
        return i18next.t('games.rules.4');
    }

    static settings() {
        const settings = [{type: 'number', max:15, min: 5, step: 1, label: i18next.t('games.settings.snake_length'), key: 'snake_length'}];

        return settings.concat(super.settings());
    }

    constructor (params) {
        const length = params.settings.snake_length || 8;
        params.snake = {points: [...Array(length + 1).keys()].slice(1).reverse().map((value) => {return {x: value, y: 1};})};

        super(params);

        this._drawer = new ShapeDrawer({field: this._field});
        this._shapeLength = 0;
        this._shapePoints = [];
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
        let point = this._snake.lastPoint();

        if (this._isCoveredShape(event.p)) {
            this._score.set();
            this._addPurpose();
        } else {
            this._snake.decreaseSnake();
            let wordPoint = this._getShapePoint(point);

            if (wordPoint) {
                this._field.fillTile(wordPoint, wordPoint.color)
            } else {
                this._field.unlockTile(point);
                this._field.cleanTile(point);
            }
        }
        
        if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
            this.handleEndGame();
        }  

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }
    
    _addPurpose() {
        for (let i = 0; i < this._shapePoints.length; i++) {
            let p = this._shapePoints[i];

            if (!this._snake.isSnake(p)) {
                this._field.unlockTile(p);
                this._field.cleanTile(p);
            }
        }

        this._shapeLength += 1;
        this._shapePoints = this._drawer.draw(this.getRandomPoint(), this._shapeLength);
        
        EventHelper.fire('add_purpose');
    }

    /**
     * @return Boolean
     */
    _isCoveredShape(point) {
        for (let i in this._shapePoints) {
            let p = this._shapePoints[i];
            if (!this._snake.isSnake(p) && !(point.x == p.x && point.y == p.y)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * @param {Object} p <p>{x;y}</p>
     * @return {Object|null}
     */
    _getShapePoint(p) {
        for (let i in this._shapePoints) {
            if (this._shapePoints[i].x == p.x && this._shapePoints[i].y == p.y) {
                return this._shapePoints[i];
            }
        }

        return null;
    }
}