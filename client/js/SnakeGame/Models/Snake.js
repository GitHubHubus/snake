import EventHelper from '../Helper/EventHelper';

export const DIRECTION_NONE = 0;
export const DIRECTION_UP = 38;
export const DIRECTION_DOWN = 40;
export const DIRECTION_LEFT = 37;
export const DIRECTION_RIGHT = 39;

const DEPRECATED_CHANGE_DIRECTION = {
    [DIRECTION_UP]: DIRECTION_DOWN,
    [DIRECTION_DOWN]: DIRECTION_UP,
    [DIRECTION_LEFT]: DIRECTION_RIGHT,
    [DIRECTION_RIGHT]: DIRECTION_LEFT,
    [DIRECTION_NONE]: DIRECTION_NONE
};

export default class Snake {
    get points() {return this._points;}
    set points(points) {this._points = points;}
    get color() {return this._color;}
    set color(c) {this._color = c;}
    get length() {return this._points.length;}
    set direction(d) {this._direction = d;}

    /**
     * @param {Object} params
     */
    constructor (params) {
        this._fixed = params.fixed || false;
        this._color = params.color || 'green';
        this._points = params.points || [{x: 5, y: 1}, {x: 4, y: 1}, {x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}];
        this._direction = DIRECTION_NONE;
        this._hold = false;
        this._speed = 0;
        this._startDirection = DIRECTION_NONE;

        if (!this._fixed) {
            this._speed = params.speed || 150;
            this._startDirection = params.direction || DIRECTION_RIGHT;

            this._handle = this._handle.bind(this);
            this._handleStart = this._handleStart.bind(this);

            document.addEventListener('keydown', this._handle);
            document.addEventListener('add_purpose', this._handleStart);
        }
    }
    
    stop(soft = false) {
        clearInterval(this._snakeInterval);

        !soft && document.removeEventListener('keydown', this._handle);
        !soft && document.removeEventListener('add_purpose', this._handleStart);
    }

    start() {
        this._snakeInterval = setInterval(this._moving.bind(this), this._speed);
    }
    
    unhold() {
        this._hold = false;
    }
    
    _handleStart() {
        if (!this._snakeInterval) {
            this._direction = this._startDirection;
            this.start();
        }
    }
    
    /**
     * @param {Object} event
     */
    _handle(event) {
        if (
                !this._hold &&
                DEPRECATED_CHANGE_DIRECTION[event.keyCode] && 
                DEPRECATED_CHANGE_DIRECTION[this._direction] !== event.keyCode
        ) {
            this._direction = event.keyCode;
            this._hold = true;
        }
    }
    
    _moving() {
        EventHelper.fire('snake_moving', {p: this._getNextPoint()});
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     * @return bool
     */
    isSnake(p) {
        for (let i in this._points) {
            if (this._points[i].x === p.x && this._points[i].y === p.y) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * @return {Object} <p>{x;y}</p>
     */
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

    /**
     * @param {Number} value
     */
    changeInterval(value) {
        if (this._snakeInterval) {
            this.stop(true);
            this._speed += value;
            this.start();
        }
    }

    lastPoint() {
        return this._points[this._points.length - 1];
    }

    decreaseSnake() {
        return this._points.splice(-1, 1)[0];
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     */
    increaseSnake(p) {
        this._points.unshift(p);
    }
}