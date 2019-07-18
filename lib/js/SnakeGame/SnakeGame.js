class SnakeGame {
    /**
     * 1. clever raccon
     * 2. endless purposes
     * 3. get out of the impasse
     * 4. draw the world
     * 5. fat snake
     */
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1}});
        this._state = null;
        this._createSnake();

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
            this._addPurpose();
        }
    }
    
    _handleSnakeMoving(event) {
        if (!this._field.isLockTile(event.p)) {
            let point = this._snake.decreaseSnake();
            this._field.unlockTile(point);
            this._field.cleanTile(point);
        } else {
            if (this._snake.isSnake(event.p)) {
                this._snake.stop();
            } else {
                this._addPurpose();
            }
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }
    
    _addPurpose() {
        let purpose = new Purpose({p: this._getRandomPoint()});

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }
    
    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._snake.isSnake(p)) {
            return this._getRandomPoint();
        }

        return p;
    }
}