class Field {
    get startPositionStrategy () {return this._startPositionStrategy;}
    set startPositionStrategy (strategy) {this._startPositionStrategy = strategy;}
    
    constructor(params) {
        this._field = params.field;
        
        this._moveStrategy = new SearchNearest(this.moveTile.bind(this), this.lockTile.bind(this));
        this._startPositionStrategy = this.getStartPositionStrategy(params.startPositionStrategy);
        this._bindedPoints = [];
    }
    
    getStartPositionStrategy(name) {
        switch (name) {
            case 'bottom':
                return new Bottom();
            case 'bottom-char':
                return new BottomChar();
            case 'center':
                return new Center();
            case 'center-char':
                return new CenterChar();
            case 'left':
                return new Left();
            case 'left-char':
                return new LeftChar();
            case 'right':
                return new Right();
            case 'right-char':
                return new RightChar();
            case 'top':
                return new Top();
            case 'top-char':
                return new TopChar();
            case 'random':
            default:
                return new Random();
        }
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
        options.id = ++this._field._counter;//??? need to move somewhere

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