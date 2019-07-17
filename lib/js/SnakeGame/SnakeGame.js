class SnakeGame {
    constructor () {
        this._field = new Field('main', {tile: {width: 10, height: 10, indent: 1, colors: ['red']}});
        this._snake = new Snake({user: true});
        this._events = [];
        this._state = null;
    }
    
    _addPurpose() {
        let p = this._getRandomPoint();
        this._field.fillTile(p);
        this._field.lockTile(p);
        
        var event = new Event('add_purpose');
        document.dispatchEvent(event, {p: p});
    }
    
    _getRandomPoint() {
        let p = this._field.getRandomPoint();

        if (this._isSnake(p)) {
            return this._getRandomPoint();
        }

        p.color = 'red';

        return p;
    }
}