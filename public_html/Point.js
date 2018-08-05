const MOVE_ON = true;
const MOVE_OUT = false;

class Point {
    static get dev () {return this._dev;};
    static set dev (dev) {this._dev = dev;};
    
    constructor (x, y, color, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
        this.dev = false;
    }
    
    move (x, y) {
        this.x = x;
        this.y = y;
    }
    
    moveDestination (destinationX, destinationY, interval, callback, lockCallback) {
        this.destination = {'x': destinationX, 'y': destinationY};
        
        this.moving = setInterval(function () {
            if (this.dev) {
                console.log({id: this.id, 'dx': this.destination.x, 'x': this.x, 'dy': this.destination.y, 'y': this.y})
            }
            
            let isEndX = this.destination.x == this.x;
            let isEndY = this.destination.y == this.y;
            let oldC = {'x':this.x, 'y': this.y};

            if (!isEndX && !isEndY && Math.random() >= 0.5) {
                this.moveXY(MOVE_ON);
            } else if (isEndX && isEndY) {
                lockCallback({'x': this.x, 'y':this.y});
                this.stopMoving();
            } else if (!isEndX) {
                this.moveX(MOVE_ON);
            } else if (!isEndY) {
                this.moveY(MOVE_ON);
            }

            let result = callback(oldC, {'x':this.x, 'y': this.y, color: this.color, id: this.id});
            
            if (!result) {
                this.x = oldC.x;
                this.y = oldC.y;

                if (!isEndX && !isEndY && Math.random() >= 0.5) {
                    this.moveXY(MOVE_OUT);
                } else {
                    if (!Math.random() >= 0.5) {
                        this.moveX(MOVE_OUT);
                    } else {
                        this.moveY(MOVE_OUT);
                    }   
                }

                callback(oldC, {'x':this.x, 'y': this.y, color: this.color, id: this.id});
            }
        }.bind(this), interval);
    }
    
    moveX(direction) {
        if (direction) {
            this.destination.x < this.x ? this.x-- : this.x++; 
        } else {
            this.destination.x < this.x ? this.x++ : this.x--;
        }
    }
    
    moveY(direction) {
        if (direction) {
            this.destination.y < this.y ? this.y-- : this.y++; 
        } else {
            this.destination.y < this.y ? this.y++ : this.y--;
        }
    }
    
    moveXY(direction) {
        this.moveX(direction);
        this.moveY(direction);
    }
    
    stopMoving() {
        clearInterval(this.moving);
        console.log({id: this.id, 'dx': this.destination.x, 'x': this.x, 'dy': this.destination.y, 'y': this.y});
    }
}