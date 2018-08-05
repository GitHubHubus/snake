const MOVE_ON = true;
const MOVE_OUT = false;

class Point {
    constructor (x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    
    move (x, y) {
        this.x = x;
        this.y = y;
    }
    
    moveDestination (destinationX, destinationY, interval, callback) {
        this.destination = {'x': destinationX, 'y': destinationY};
        
        this.moving = setInterval(function () {
            let isEndX = this.destination.x == this.x;
            let isEndY = this.destination.y == this.y;
            let oldC = {'x':this.x, 'y': this.y};

            if (!isEndX && !isEndY && Math.random() >= 0.5) {
                this.moveXY(MOVE_ON);
            } else if (isEndX && isEndY) {
                this.stopMoving();
            } else if (!isEndX) {
                this.moveX(MOVE_ON);
            } else if (!isEndY) {
                this.moveY(MOVE_ON);
            }

            let result = callback(oldC, {'x':this.x, 'y': this.y, color: this.color});
            
            if (!result) {
                this.x = oldC.x;
                this.y = oldC.y;

                if (!isEndX && !isEndY && Math.random() >= 0.5) {
                    this.moveXY(MOVE_ON);
                } else if (!isEndX) {
                    if (Math.random() >= 0.5) {
                        this.moveX(MOVE_ON);
                    } else {
                        this.moveY(MOVE_ON);
                    }   
                }

                callback(oldC, {'x':this.x, 'y': this.y, color: this.color});
            }
        }.bind(this), interval);
    }
    
    moveX(direction) {
        if (direction) {
            this.x = this.destination.x < this.x ? this.x - 1 : this.x + 1; 
        } else {
            this.x = this.destination.x < this.x ? this.x + 1 : this.x - 1;
        }
    }
    
    moveY(direction) {
        if (direction) {
            this.y = this.destination.y < this.y ? this.y - 1 : this.y + 1; 
        } else {
            this.y = this.destination.y < this.y ? this.y + 1 : this.y - 1;
        }
    }
    
    moveXY(direction) {
        if (direction) {
            this.x = this.destination.x < this.x ? this.x - 1 : this.x + 1;
            this.y = this.destination.y < this.y ? this.y - 1 : this.y + 1; 
        } else {
            this.x = this.destination.x < this.x ? this.x + 1 : this.x - 1;
            this.y = this.destination.y < this.y ? this.y + 1 : this.y - 1;
        }
    }
    
    stopMoving() {
        clearInterval(this.moving);
    }
}