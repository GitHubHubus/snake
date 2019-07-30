import EventHelper from './Helper/EventHelper';
import Purpose from './Models/Purpose';
import Score from './Score';
import Field from '../Core/Field';
import Snake from './Models/Snake';

export default class SnakeGame6 {
    /**
     * 6. portals as goal
     */
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1}, width: 150, height:150, border: true});
        this._portals = [];
        this._createSnake();
        
        this._score = new Score();
        
        document.addEventListener('keydown', this._handle.bind(this), false);
        document.addEventListener('snake_moving', this._handleSnakeMoving.bind(this), false);
    }

    _createSnake(points) {
        points = points || null;
        this._snake = new Snake({points: points});
        
        for (let i in this._snake.points) {
            this._field.fillTile(this._snake.points[i], this._snake.color);
        }
    }
    
    _handle(event) {
        if (event.keyCode === 32) {
            for (let i = 0; i < 4; i++) {
                this._addPortal();
            }
            
            EventHelper.fire('add_purpose');
        }
    }
    
    _handleSnakeMoving(event) {
        let point = this._snake.decreaseSnake();
        let outPortal = null;
        
        if (this._field.isBorder(point)) {
            this._removePortal(point);
        } else {
            this._field.unlockTile(point);
            this._field.cleanTile(point);
        }

        if (this.isPortal(event.p)) {
            outPortal = this._getRandomOutPortal(event.p);
        } else if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
            this._snake.stop();
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

    _removePortal(p) {
        this._field.fillTile(p);
        
        for (let i in this._portals) {
            if (this._portals[i].p.x == p.x && this._portals[i].p.y == p.y) {
                this._portals.splice(i, 1);
                
                break;
            }
        }
        
        this._addPortal();
    }

    isPortal(p) {
        for (let i in this._portals) {
            if (this._portals[i].p.x == p.x && this._portals[i].p.y == p.y) {
                return true;
            }
        }
        
        return false;
    }

    _getRandomBorderPoint() {
        let p = this._field.getRandomBorderPoint();

        if (this.isPortal(p) || this._field.isBorderAngle(p)) {
            return this._getRandomBorderPoint();
        }

        return p;
    }
    
    _getRandomPortal() {
        return this._portals[parseInt(Math.random() * this._portals.length)];
    }
    
    _getRandomOutPortal(p) {
        let portal = this._getRandomPortal();
        
        if (portal.p.x == p.x && portal.p.y == p.y) {
            return this._getRandomPortal();
        }
        
        return portal;
    }
}