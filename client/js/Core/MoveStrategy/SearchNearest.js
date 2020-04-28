class SearchNearest {
    constructor (viewMoveFunction, viewLockFunction) {
        this.viewMoveFunction = viewMoveFunction;
        this.viewLockFunction = viewLockFunction;
        this.points = {};
    }
    
    startMoving (p) {
        this.points[p.id] = setInterval(function () {
            let currentPlace = {'x': p.x, 'y': p.y};
            let points = this.searchNearest(p);
            
            for (let i = 0; i < points.length; i++) {
                let point = points[i];

                if (point.x != p.last.x && point.y != p.last.y) {
                    point.id = p.id;
                    point.color = p.color;
                    let result = this.viewMoveFunction(currentPlace, point);
                
                    if (result) {
                        p.recordLast();
                        p.x = point.x;
                        p.y = point.y;
                    
                        this.isFinished(p);
                    }
                    
                    return false;
                }
            }
            
            
        }.bind(this), p.frequency);
    }
    
    isFinished(p) {
        if (p.inPlace(true) && p.inPlace(false)) {
            this.viewLockFunction(p);
            this.stopMoving(p);
            p.stoped = true;
            return true;
        }
        
        return false;
    }
    
    searchNearest(p) {
        let points = [{p:[-1, -1], d:37}, {p:[0, -1], d:37}, {p:[1, -1], d:38}, {p:[-1, 0], d:40}, {p:[1, 0], d:38}, {p:[-1, 1], d:40}, {p:[0, 1], d:39}, {p:[1, 1], d:39}];
        let result = [];
        for (let i = 0; i < points.length; i++) {
            let point = {'x': (p.x + points[i].p[0]), 'y': (p.y + points[i].p[1])};
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
    
    stopMoving(p) {
        clearInterval(this.points[p.id]);
        console.log({id: p.id, 'dx': p.destination.x, 'x': p.x, 'dy': p.destination.y, 'y': p.y});
    }
}