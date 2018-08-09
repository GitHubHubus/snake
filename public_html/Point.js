const DESTINATION_X = true;
const DESTINATION_Y = false;

class Point {
    get x () {return this._x;}
    set x (x) {this._x = x;}
    
    get y () {return this._y;}
    set y (y) {this._y = y;}
    
    get color () {return this._color;}
    set color (color) {this._color = color;}

    get destination () {return this._destination;}
    set destination (d) {this._destination = d;}

    get id () {return this._id;}
    set id (id) {this._id = id;}

    constructor (options) {
        this._x = options.x ? options.x : 0;
        this._y = options.y ? options.y : 0;
        this._color = options.color ? options.color : '#fff';
        this._id = options.id ? options.id : null;
        this._destination = options.destination ? options.destination : {'x': 0, 'y': 0};
    }
    
    move (x, y) {
        this._x = x;
        this._y = y;
    }
    
    inPlace (destination) {
        return destination === DESTINATION_X ? this.destination.x === this.x : this.destination.y === this.y;
    }
}