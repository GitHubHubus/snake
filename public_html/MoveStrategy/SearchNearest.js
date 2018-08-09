class SearchNearest {
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
            }

            let points = this.searchNearest(p);
            
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                point.id = p.id;
                point.color = p.color;
                
                if (point.x != p.last.x && point.y != p.last.y) {
                    let result = this.viewMoveFunction(currentPlace, point);
                
                    if (result) {
                        p.recordLast();
                        p.x = point.x;
                        p.y = point.y;
                    
                        return false;
                    }
                }
            }
        }.bind(this), interval);
    }
    
    searchNearest(p) {
        let points = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
        let result = [];
        for (let i = 0; i < points.length; i++) {
            let point = {'x': (p.x + points[i][0]), 'y': (p.y + points[i][1])};
            point.l = Math.sqrt(Math.pow(p.destination.x - point.x, 2) + Math.pow(p.destination.y - point.y, 2));
            
            result.push(point);
        }
        
        result.sort(function (first, second) {
            if (first.l < second.l) {
                return -1;
            }
            
            if (first.l > second.l) {
                return 1;
            }
            
            return 0;
        });
        
        return result;
    }
    
    stopMoving(id) {
        clearInterval(this.points[id]);
      //  console.log({id: this.id, 'dx': this.destination.x, 'x': this.x, 'dy': this.destination.y, 'y': this.y});
    }
}