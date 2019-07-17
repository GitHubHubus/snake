class TextDrawer extends Drawer {
    constructor(params) {
        this._field = params.field;
        this._color = params.color ? params.color : '#ebedf0';
        
        super(params);
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