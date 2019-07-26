
class SnakeGame2 {
    /**
     * 2. endless purposes
     */
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1}, border: true});
        this._purposeTypes = [
            {type: 'remove_purpose_by_area', color: 'yellow', action: function (){}},
            {type: 'increase_snake', color: 'red', action: function (){}},
            {type: 'decrease_snake', color: 'orange', action: function (){}},
            {type: 'increase_speed_snake', color: 'blue', action: function (){}},
            {type: 'decrease_speed_snake', color: 'gray', action: function (){}},
            {type: 'increase_speed_add_purpose', color: 'brown', action: function (){}},
            {type: 'decrease_speed_add_purpose', color: 'bluewhite', action: function (){}},
        ];
        this.purposes = [];
        this._state = null;
        this._createSnake();
        this._purposesAddInterval = null;
        
        
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
            this._purposesAddInterval = setInterval(this._addPurpose.bind(this), 300);
        }
    }
    
    _handleSnakeMoving(event) {
        if (!this._field.isLockTile(event.p)) {
            let point = this._snake.decreaseSnake();
            this._field.unlockTile(point);
            this._field.cleanTile(point);
        } else if (this._snake.isSnake(event.p)) {
            this._snake.stop();
        } else {
            this._removePurpose(event.p);
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }
    
    _removePurpose(p) {
        this.purposes.filter(function(el){
            return el.p.x != p.x && el.p.y != p.y;
        });
    }
    
    _addPurpose() {
        let params = this._purposeTypes[0];
        params.p = this._getRandomPoint();
        
        let purpose = new Purpose(params);

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        this.purposes.push(purpose);
        
        EventHelper.fire('add_purpose', {purpose: purpose});
    }
    
    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._field.isLockTile(p)) {
            return this._getRandomPoint();
        }

        return p;
    }
}