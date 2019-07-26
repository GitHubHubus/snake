
class SnakeGame2 {
    /**
     * 2. endless purposes
     */
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1}, width: 200, height:200, border: true});
        this._purposeTypes = [
            {type: 'remove_purposes_by_area', color: 'yellow', action: this._removePurposesByArea},
            {type: 'increase_snake', color: 'red', action: this._increaseSnake},
            {type: 'decrease_snake', color: 'orange', action: this._decreaseSnake},
            {type: 'increase_speed_snake', color: 'blue', action: this._increaseSnakeSpeed},
            {type: 'decrease_speed_snake', color: 'gray', action: this._decreaseSnakeSpeed},
            {type: 'increase_speed_add_purpose', color: 'brown', action: this._increaseAddPurposeSpeed},
            {type: 'decrease_speed_add_purpose', color: 'bluewhite', action: this._decreaseAddPurposeSpeed}
        ];
        this._purposes = [];
        this._state = null;
        this._createSnake();
        this._purposesAddInterval = null;
        this._purposesAddSpeed = 300;
        
        this._score = new Score();
        
        document.addEventListener('keydown', this._handle.bind(this), false);
        document.addEventListener('snake_moving', this._handleSnakeMoving.bind(this), false);
    }
    
    _stopAddPurpose() {
        clearInterval(this._purposesAddInterval);
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
            this._purposesAddInterval = setInterval(this._addPurpose.bind(this), this._purposesAddSpeed);
        }
    }
    
    _handleSnakeMoving(event) {
        let point = this._snake.decreaseSnake();
            this._field.unlockTile(point);
            this._field.cleanTile(point);
        
        if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
            this._snake.stop();
            this._stopAddPurpose();
        } else {
            this._executeAndRemovePurpose(event.p);
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }
    
    _slicePurpose(p) {
        let purpose = null;

        for (let i in this._purposes) {
            if (this._purposes[i].p.x == p.x && this._purposes[i].p.y == p.y) {
                purpose = this._purposes[i];

                this._purposes.splice(i, 1);
                
                break;
            }
        }
        
        return purpose;
    }
    
    _executeAndRemovePurpose(p) {
        let purpose = this._slicePurpose(p);

        if (purpose) {
            purpose.action();
            this._score.set();
        }
    }
    
    _addPurpose() {
        let params = this._getRandomPurposeType();
        params.p = this._getRandomPoint();

        let purpose = new Purpose(params);
        purpose._closure = this;

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        this._purposes.push(purpose);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }

    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._field.isLockTile(p)) {
            return this._getRandomPoint();
        }

        return p;
    }

    _getRandomPurposeType() {
        return this._purposeTypes[parseInt(Math.random() * this._purposeTypes.length)];
    }

    _removePurposesByArea() {
        let square = [-2, -1, 0, 1, 2];
        for (let i in square) {
            for (let j in square) {
                let p = {x: this.p.x + square[i], y: this.p.y + square[j]};

                if (!this._closure._snake.isSnake(p) && !this._closure._field.isBorder(p)) {
                    let purpose = this._closure._slicePurpose(p);
                    
                    if (purpose) {
                        this._closure._field.unlockTile(purpose.p);
                        this._closure._field.cleanTile(purpose.p);
                    }
                }
            }
        }
    }
    
    _increaseSnake() {
        this._closure._snake.increaseSnake(this.p);
        this._closure._field.fillTile(this.p, this._closure._snake.color);
        this._closure._field.lockTile(this.p);
    }
    
    _decreaseSnake() {
        if (this._closure._snake.length > 1) {
            let point = this._closure._snake.decreaseSnake();
            this._closure._field.unlockTile(point);
            this._closure._field.cleanTile(point); 
        }
    }
    
    _decreaseSnakeSpeed() {
        this._closure._snake.changeInterval(10);
    }
    
    _increaseSnakeSpeed() {
        this._closure._snake.changeInterval(-10);
    }
    
    _decreaseAddPurposeSpeed() {
        this._closure._purposesAddSpeed += 10;
        this._closure._stopAddPurpose();
        this._closure._purposesAddInterval = setInterval(this._closure._addPurpose.bind(this._closure), this._closure._purposesAddSpeed);
    }
    
    _increaseAddPurposeSpeed() {
        this._closure._purposesAddSpeed -= 10;
        this._closure._stopAddPurpose();
        this._closure._purposesAddInterval = setInterval(this._closure._addPurpose.bind(this._closure), this._closure._purposesAddSpeed);
    }
}