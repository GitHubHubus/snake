import EventHelper from '../Helper/EventHelper';

const DIRECTION_NONE = 0;
const DIRECTION_UP = 38;
const DIRECTION_DOWN = 40;
const DIRECTION_LEFT = 37;
const DIRECTION_RIGHT = 39;

export default class Snake {
    get points() {return this._points;}
    get color() {return this._color;}
    get length() {return this._points.length;}
    set direction(d) {this._direction = d;}
    
    constructor (params) {
        this._color = params.color || 'green';
        this._points = params.points || [{x: 5, y: 1}, {x: 4, y: 1}, {x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}];
        this._direction = DIRECTION_NONE;
        this._speed = 100;

        document.addEventListener('keydown', this._handle.bind(this), false);
        document.addEventListener('add_purpose', this._handleStart.bind(this), false);
    }
    
    stop() {
        clearInterval(this._snakeInterval);
    }
    
    _handleStart() {
        if (!this._snakeInterval) {
            this._direction = DIRECTION_RIGHT;
            this._snakeInterval = setInterval(this._moving.bind(this), this._speed);
        }
    }
    
    _handle(event) {
        this._direction = event.keyCode;
    }
    
    _moving() {
        EventHelper.fire('snake_moving', {p: this._getNextPoint()});
    }
    
    isSnake(p) {
        for (let i in this._points) {
            if (this._points[i].x == p.x && this._points[i].y == p.y) {
                return true;
            }
        }
        
        return false;
    }

    _getNextPoint() {
        let point = this._points.slice(0, 1)[0];
        let p = {x: 0, y: 0};

        switch (this._direction) {
            case DIRECTION_UP:
                p.y = point.y - 1;
                p.x = point.x;
                break;
            case DIRECTION_DOWN:
                p.y = point.y + 1;
                p.x = point.x;
                break;
            case DIRECTION_LEFT:
                p.y = point.y;
                p.x = point.x - 1;
                break;
            case DIRECTION_RIGHT:
                p.y = point.y;
                p.x = point.x + 1;
                break;
        }
        
        return p;
    }
    
    changeInterval(value) {
        if (this._snakeInterval) {
            this.stop();
            this._speed += value;
            this._snakeInterval = setInterval(this._moving.bind(this), this._speed);
        }
    }

    decreaseSnake() {
        return this._points.splice(-1, 1)[0];
    }
    
    increaseSnake(p) {
        this._points.unshift(p);
    }
}