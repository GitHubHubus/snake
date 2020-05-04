import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from './Helper/EventHelper';
import Purpose from './Models/Purpose';
import TextDrawer from '../Core/Drawer/TextDrawer';
import i18next from 'i18next';

export default class SnakeGame4 extends BaseSnakeGame {
    static description () {
        return i18next.t('games.description.4');;
    }

    static rules() {
        return i18next.t('games.rules.4');
    }

    static settings() {
        const settings = [];

        return settings.concat(super.settings());
    }

    constructor (params) {
        super(params);

        this._drawer = new TextDrawer({field: this._field, colors: ['orange']});
        this._wordPoints = this._drawer.draw(':', {x: 20, y: 10});
        this._purpose = null;
    }

    /**
     * @param {Object} event
     */
    _handle(event) {
        this._addPurpose();

        EventHelper.fire('add_purpose');
    }
    
    /**
     * @param {Object} event
     */
    _handleSnakeMoving(event) {
        let point = this._snake.decreaseSnake();
        let wordPoint = this._getWordPoint(point);
            
        if (wordPoint) {
            this._field.fillTile(wordPoint, wordPoint.color)
        } else {
            this._field.unlockTile(point);
            this._field.cleanTile(point);
        }
        
        if (this._isPurpose(event.p)) {
            this._score.set();
            this._addPurpose();
        }
        
        if (this._snake.isSnake(event.p) || this._field.isBorder(event.p) || this._isCoveredWord(event.p)) {
            this.handleEndGame();
        }  

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }
    
    _addPurpose() {
        this._purpose = new Purpose({p: this.getRandomPoint()});

        this._field.fillTile(this._purpose.p, this._purpose.color);
        this._field.lockTile(this._purpose.p);
        
        EventHelper.fire('add_purpose', {purpose: this._purpose});
    }

    /**
     * @return Boolean
     */
    _isCoveredWord(point) {
        if (this._wordPoints.length > this._snake.length) {
            return false;
        }
        
        for (let i in this._wordPoints) {
            let p = this._wordPoints[i];
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
    _getWordPoint(p) {
        for (let i in this._wordPoints) {
            if (this._wordPoints[i].x == p.x && this._wordPoints[i].y == p.y) {
                return this._wordPoints[i];
            }
        }
        
        return null;
    }

    /**
     * @param {Object} <p>{x; y}</p>
     * @return {Boolean}
     */
    _isPurpose(p) {
        return this._purpose && this._purpose.p.x == p.x && this._purpose.p.y == p.y;
    }
}