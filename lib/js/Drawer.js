class Field {
    get startPositionStrategy () {return this._startPositionStrategy;}
    set startPositionStrategy (strategy) {this._startPositionStrategy = strategy;}
    
    constructor(params) {
        this._field = params.field;
        this._color = params.color ? params.color : '#ebedf0';
        
        this._moveStrategy = new SearchNearest(this.moveTile.bind(this), this.lockTile.bind(this));
        this._startPositionStrategy = this.getStartPositionStrategy(params.startPositionStrategy);
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
    
    drawText(text, startPoint, isAnimate) {
        let point = startPoint;
        
        for(var char in text) {
            let data = symbols[text[char]];
            if (data) {
                for (let i in data.coordinates) {
                    let params = {
                        color: this._field._getRandomColor(),
                        id: ++this._field._counter
                    };
                    
                    if (isAnimate) {
                        let coordinates = this.startPositionStrategy.get({width: data.width, max: {x: this._field._countX, y: this._field._countY}, x: point.x, y: point.y});
                        params.x = coordinates.x;
                        params.y = coordinates.y;
                        params.destination = {'x': point.x + data.coordinates[i][0], 'y': point.y - data.coordinates[i][1]};
                    
                        this._moveStrategy.startMoving(new Point(params));
                    } else {
                        params.x = point.x + data.coordinates[i][0];
                        params.y = point.y - data.coordinates[i][1];

                        this._field.fillTile(new Point(params));
                    }
                }

                point.x += data.width + 1;
            } else {
                point.x += 3;
            }
        }
    }
}