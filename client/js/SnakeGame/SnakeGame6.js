import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from './Helper/EventHelper';
import Purpose from './Models/Purpose';
import {Field, DEFAULT_TILE_SIZE} from '../Core/Field';

export default class SnakeGame6 extends BaseSnakeGame {
    static description () {
        return 'Portal as goal';
    }

    constructor (params) {
        params.field = new Field('main', {tile: DEFAULT_TILE_SIZE, width: 150, height:150, border: true})
        super(params);
        
        this._numberPortals = 4;
        this._portals = [];
    }

    /**
     * @param {Object} event
     */
    _handle(event) {
        for (let i = 0; i < this._numberPortals; i++) {
            this._addPortal();
        }

        EventHelper.fire('add_purpose');
    }
    
    /**
     * @param {Object} event
     */
    _handleSnakeMoving(event) {
        let point = this._snake.decreaseSnake();
        let outPortal = null;
        
        if (this._field.isBorder(point)) {
            this._field.fillTile(point);
            this._removePortal(point);
            this._addPortal();
        } else {
            this._field.unlockTile(point);
            this._field.cleanTile(point);
        }

        if (this.isPortal(event.p)) {
            this._lockPortal(event.p);
            outPortal = this._getRandomOutPortal(event.p);
            this._score.set();
        } else if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
            console.log(event.p);
            this.handleEndGame();
        }  

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
        
        if (outPortal !== null) {
            this._snake.direction = outPortal.direction;
            this._snake.increaseSnake(outPortal.p);
            this._field.fillTile(outPortal.p, this._snake.color);
            this._field.lockTile(outPortal.p);
        }
    }
    
    _addPortal() {
        let border = this._getRandomBorderPoint();

        let portal = new Purpose({
            color: 'yellow',
            p: {x: border.x, y: border.y}
        });
        portal.direction = border.direction;
        
        this._field.fillTile(portal.p, portal.color);

        this._portals.push(portal);

        EventHelper.fire('add_portal', {portal: portal});
    }

    /**
     * @param {Object} p <p>{x;y}</p>
     */
    _removePortal(p) {
        for (let i in this._portals) {
            if (this._portals[i].p.x == p.x && this._portals[i].p.y == p.y) {
                this._portals.splice(i, 1);
                
                break;
            }
        }
    }

    /**
     * @param {Object} p <p>{x;y}</p>
     */
    _iteratePortals(callback) {
        for (let i in this._portals) {
            if (this._portals[i].p.x == p.x && this._portals[i].p.y == p.y) {
                callback(i);
                break;
            }
        }
    }

    /**
     * @param {Object} p <p>{x;y}</p>
     */
    _lockPortal(p) {
        for (let i in this._portals) {
            if (this._portals[i].p.x == p.x && this._portals[i].p.y == p.y) {
                this._portals[i].lock = true;
                
                break;
            }
        }
    }

    /**
     * @param {Object} p <p>{x;y}</p>
     * @return Boolean
     */
    isPortal(p) {
        for (let i in this._portals) {
            if (this._portals[i].p.x == p.x && this._portals[i].p.y == p.y) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * @return {Object} <p>{x;y}</p>
     */
    _getRandomBorderPoint() {
        let p = this._field.getRandomBorderPoint();

        if (this.isPortal(p) || this._field.isBorderAngle(p)) {
            return this._getRandomBorderPoint();
        }

        return p;
    }

    /**
     * @return {Purpose}
     */
    _getRandomPortal() {
        return this._portals[parseInt(Math.random() * this._portals.length)];
    }

    /**
     * @param {Object} p <p>{x;y}</p>
     * @return {Purpose}
     */
    _getRandomOutPortal(p) {
        let portal = this._getRandomPortal();
        
        if ((portal.p.x == p.x && portal.p.y == p.y) || portal.lock) {
            return this._getRandomOutPortal(p);
        }
        
        portal.lock = true;
        
        return portal;
    }
}