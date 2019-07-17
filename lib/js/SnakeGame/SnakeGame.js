class SnakeGame {
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1, colors: ['red']}});
        this._snake = new Snake({user: true, field:this._field});
        this._events = [];
        this._state = null;
        document.addEventListener('keydown', this._handle.bind(this), false);
        document.addEventListener('destinate_purpose', this._addPurpose.bind(this), false);
        
        this._enemy = new Snake({field:this._field, start: [{x: 4, y: 4}, {x: 3, y: 4}, {x: 2, y: 4}, {x: 1, y: 4}, {x: 0, y: 4}], color: 'green'});
    }
    
    _handle(event) {
        if (event.keyCode === 32) {

            this._addPurpose();
        }
    }
    
    _addPurpose() {
        let p = this._getRandomPoint();
        this._field.fillTile(p, 'red');
        this._field.lockTile(p);
        
        let event = new Event('add_purpose');
        event.p = p;
        document.dispatchEvent(event);
    }
    
    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._snake.isSnake(p) || this._enemy.isSnake(p)) {
            return this._getRandomPoint();
        }

        return p;
    }
}