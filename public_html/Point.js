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
        this.moving = setInterval(function () {
            let isEndX = destinationX == this.x;
            let isEndY = destinationY == this.y;
            let direction;

            if (!isEndX && !isEndY) {
                direction = Math.random() >= 0.5;
            } else if (isEndX && isEndY) {
                this.stopMoving();
            } else {
                direction = isEndX;
            }

            let oldC = {'x':this.x, 'y': this.y};
            
            if (!direction) {
                this.x = destinationX < this.x ? this.x - 1 : this.x + 1; 
            } else {
                this.y = destinationY < this.y ? this.y - 1 : this.y + 1;
            }
            let newC = {'x':this.x, 'y': this.y, color: this.color};

            let result = callback(oldC, newC);
            
            if (!result) {
                this.x = oldC.x;
                this.y = oldC.y;
            }
        }.bind(this), interval);
    }
    
    stopMoving() {
        clearInterval(this.moving);
    }
}