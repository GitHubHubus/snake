class SnakeGame {
    /**
     * 1. clever raccon
     * 2. endless purposes
     * 3. get out of the impasse
     * 4. draw the world
     * 5. fat snake
     */
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1, colors: ['red']}});
        this._snake = new Snake({user: true, field:this._field});
        this._events = [];
        this._state = null;
        document.addEventListener('keydown', this._handle.bind(this), false);
        document.addEventListener('destinate_purpose', this._addPurpose.bind(this), false);
    }
    
    _handle(event) {
        if (event.keyCode === 32) {
            this._addPurpose();
        }
    }
    
    _addPurpose() {
        let purpose = new Purpose({p: this._getRandomPoint()});

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);
        
        this._fireEvent('add_purpose', {purpose: purpose})
    }
    
    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._snake.isSnake(p)) {
            return this._getRandomPoint();
        }

        return p;
    }
    
    _fireEvent(type, params) {
        let event = new Event(type);
        
        for (var prop in params) {
            event[prop] = params[prop];
        }

        document.dispatchEvent(event);
    }
}