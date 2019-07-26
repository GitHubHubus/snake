class TextDrawer extends Drawer {
    constructor(params) {
        super(params);
        this._field = params.field;
        this._colors = params.colors || ['red'];
    }

    draw(text, startPoint, isAnimate) {
        for(var char in text) {
            let data = symbols[text[char]];

            if (data) {
                for (let i in data.coordinates) {
                    let params = {
                        color: this._colors[0],
                        id: ++this._field.counter
                    };
                    
                    if (isAnimate) {
                        let coordinates = this.startPositionStrategy.get({width: data.width, max: {x: this._field._countX, y: this._field._countY}, x: startPoint.x, y: startPoint.y});
                        params.x = coordinates.x;
                        params.y = coordinates.y;
                        params.destination = {'x': startPoint.x + data.coordinates[i][0], 'y': startPoint.y + data.coordinates[i][1]};
                    
                        this._moveStrategy.startMoving(new Point(params));
                    } else {
                        params.x = startPoint.x + data.coordinates[i][0];
                        params.y = startPoint.y + data.coordinates[i][1];

                        this._field.fillTile(params);
                    }
                }

                startPoint.x += data.width + 1;
            } else {
                startPoint.x += 3;
            }
        }
    }
}