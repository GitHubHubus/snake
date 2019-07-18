class Runner extends Drawer {
    constructor(params) {
        super(params);

        this._field = params.field;
        this._bindedPoints = [];
    }
    
    _rerunPoint(point) {
        if (point.stoped && (!point.inPlace(true) || !point.inPlace(false))) {
            point.stoped = false;
            this._moveStrategy.startMoving(point);
        }
    }

    bindPoints(points) {
        let self = this;
        let nodes = document.querySelectorAll('div.field-node');
        
        points.forEach((p) => {
            this._moveStrategy.startMoving(p);
            this._bindedPoints.push(p);
        });

        nodes.forEach(function (element) {
            element.addEventListener('mouseenter', function (e) {
                self._bindedPoints.forEach((point) => {
                    point.destination = {
                        x: parseInt(e.target.dataset.x),
                        y: parseInt(e.target.dataset.y)
                    };
        
                    self._field.unlockTile(point);
                    self._rerunPoint(point);
                });
            }, false);
        });
    }
    
    createPoint (options) {
        if (!options.departure) {
            options.departure = this.startPositionStrategy.get({width: 0, max: {x: this._field.countX, y: this._field.countY}, x: 0, y: 0});
        }

        if (!options.color) {
            options.color = this._field.getRandomColor();
        }

        if (!options.destination) {
           options.destination = this.startPositionStrategy.get({width: 0, max: {x: this._field.countX, y: this._field.countY}, x: 0, y: 0}); 
        }

        return new Point(options);
    }
}