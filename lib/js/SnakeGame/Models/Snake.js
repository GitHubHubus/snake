const DIRECTION_NONE = 0;
const DIRECTION_UP = 38;
const DIRECTION_DOWN = 40;
const DIRECTION_LEFT = 37;
const DIRECTION_RIGHT = 39;

class Snake {
    constructor (params) {
        this._field = params.field;
        this._color = params.color;
        this._snake = params.start || [{x: 4, y: 0}, {x: 3, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}];
        this._direction = DIRECTION_NONE;

        for (let i in this._snake) {
            this._field.fillTile(this._snake[i], this._color);
        }

        document.addEventListener('keydown', this._handle.bind(this), false);
        document.addEventListener('add_purpose', this._handleStart.bind(this), false);
    }
    
    _handleStart() {
        if (!this._snakeInterval) {
            this._direction = DIRECTION_RIGHT;
            this._snakeInterval = setInterval(this._moving.bind(this), 100);
        }
    }
    
    _handle(event) {
        this._direction = event.keyCode;
    }
    
    _moving() {
        let point = this._getNextPoint();

        if (!this._field.isLockTile(point)) {
            this._decreaseSnake();
        } else {
            if (this.isSnake(point)) {
                clearInterval(this._snakeInterval);
            } else {
                document.dispatchEvent(new Event('destinate_purpose'));
            }
        }

        this._increaseSnake(point);
    }
    
    isSnake(p) {
        for (let i in this._snake) {
            if (this._snake[i].x == p.x && this._snake[i].y == p.y) {
                return true;
            }
        }
        
        return false;
    }

    _getNextPoint() {
        let point = this._snake.slice(0, 1)[0];
        let p = {x:0, y:0};

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
    
    _decreaseSnake() {
        let remove = this._snake.splice(-1, 1)[0];
        this._field.unlockTile(remove);
        this._field.cleanTile(remove);
    }
    
    _increaseSnake(p) {
        this._snake.unshift(p);
        this._field.fillTile(p, this._color);
        this._field.lockTile(p);
    }
}