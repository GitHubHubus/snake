const DIRECTION_NONE = 0;
const DIRECTION_UP = 38;
const DIRECTION_DOWN = 40;
const DIRECTION_LEFT = 37;
const DIRECTION_RIGHT = 39;

class SnakeGame {
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1, colors: ['red']}});
        this._snake = [{x: 4, y: 0}, {x: 3, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}];
        this._events = [];
        this._direction = DIRECTION_NONE;
        this._state = null;

        for (let i in this._snake) {
            this._field.fillTile(this._snake[i]);
        }

        document.addEventListener('keydown', this._handle.bind(this), false);
    }
    
    _handle(event) {
        if (event.keyCode === 32) { //space
            console.log('space: ' + event.keyCode);
            this._snakeInterval = setInterval(this.move.bind(this), 100);

            this._addPurpose();
            this._direction = DIRECTION_RIGHT;

            return;
        }
        console.log('key: ' + event.keyCode);
        this._direction = event.keyCode;
    }
    
    _isSnake(p) {
        for (let i in this._snake) {
            if (this._snake[i].x == p.x && this._snake[i].y == p.y) {
                return true;
            }
        }
        
        return false;
    }
    
    _addPurpose() {
        let p = this._getRandomPoint();
        this._field.fillTile(p);
        this._field.lockTile(p);
    }
    
    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._isSnake(p)) {
            return this._getRandomPoint();
        }

        p.color = 'red'

        return p;
    }
    
    move() {
        let point = this._snake.slice(0, 1)[0];
        let newPoint = {x:0, y:0};

        switch (this._direction) {
            case DIRECTION_UP:
                newPoint.y = point.y - 1;
                newPoint.x = point.x;
                break;
            case DIRECTION_DOWN:
                newPoint.y = point.y + 1;
                newPoint.x = point.x;
                break;
            case DIRECTION_LEFT:
                newPoint.y = point.y;
                newPoint.x = point.x - 1;
                break;
            case DIRECTION_RIGHT:
                newPoint.y = point.y;
                newPoint.x = point.x + 1;
                break;
        }

        if (!this._field.isLockTile(newPoint)) {
            let removed = this._snake.splice(-1, 1)[0];
            this._field.unlockTile(removed);
            this._field.cleanTile(removed);
        } else {
            if (this._isSnake(newPoint)) {
                clearInterval(this._snakeInterval);
            } else {
                this._addPurpose();
            }
        }

        if (this.validation(newPoint)) {
            this._snake.unshift(newPoint);
            this._field.fillTile(newPoint);
            this._field.lockTile(newPoint);
        }
    }
    
    validation(point) {
        return true;
    }
}