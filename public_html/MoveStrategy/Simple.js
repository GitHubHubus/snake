const MOVE_ON = true;
const MOVE_OUT = false;

class Simple {
    constructor (viewMoveFunction, viewLockFunction) {
        this.viewMoveFunction = viewMoveFunction;
        this.viewLockFunction = viewLockFunction;
        this.points = {};
    }
    
    startMoving (p, interval) {
        this.points[p.id] = setInterval(function () {
            let isEndX = p.inPlace(true);
            let isEndY = p.inPlace(false);
            let currentPlace = {'x': p.x, 'y': p.y};
 
            if (isEndX && isEndY) {
                this.viewLockFunction(p);
                this.stopMoving(p.id);
                return;
            } else if (!isEndX && !isEndY && Math.random() >= 0.5) {
                this.moveXY(MOVE_ON, p);
            } else if (!isEndX) {
                this.moveX(MOVE_ON, p);
            } else if (!isEndY) {
                this.moveY(MOVE_ON, p);
            }

            let result = this.viewMoveFunction(currentPlace, p);
            
            if (!result) {
                p.x = currentPlace.x;
                p.y = currentPlace.y;

                if (!isEndX && !isEndY && Math.random() >= 0.5) {
                    this.moveXY(MOVE_OUT, p);
                } else {
                    if (!isEndY && Math.random() >= 0.5) {
                        this.moveX(MOVE_OUT, p);
                    } else if (!isEndX && Math.random() >= 0.5) {
                        this.moveY(MOVE_OUT, p);
                    }   
                }

                this.viewMoveFunction(currentPlace, p);
            }
        }.bind(this), interval);
    }
    
    moveX(direction, p) {
        if (direction) {
            p.destination.x < p.x ? p.x-- : p.x++; 
        } else {
            p.destination.x < p.x ? p.x++ : p.x--;
        }
    }
    
    moveY(direction, p) {
        if (direction) {
            p.destination.y < p.y ? p.y-- : p.y++; 
        } else {
            p.destination.y < p.y ? p.y++ : p.y--;
        }
    }
    
    moveXY(direction, p) {
        this.moveX(direction, p);
        this.moveY(direction, p);
    }
    
    stopMoving(id) {
        clearInterval(this.points[id]);
      //  console.log({id: this.id, 'dx': this.destination.x, 'x': this.x, 'dy': this.destination.y, 'y': this.y});
    }
}