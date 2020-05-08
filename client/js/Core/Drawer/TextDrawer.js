import Symbols from './Symbols';
import Drawer from './Drawer';

export default class TextDrawer extends Drawer {
    /**
     * @param {Object} params
     */
    constructor(params) {
        super(params);
        this._field = params.field;
        this._colors = params.colors || ['red'];
        this._points = [];
    }

    /**
     * @param {String} text
     * @param {Object} startPoint <p>{x; y}</p>
     * @param {Boolean} isAnimate
     * @param {String} color
     * @return {Array}
     */
    draw(text, startPoint, isAnimate = false, color = null) {
        let start = Object.assign({}, startPoint);

        for(var char in text) {
            let data = Symbols[text[char]];

            if (data) {
                for (let i in data.coordinates) {
                    let params = {
                        color: color  || this._colors[0],
                        id: ++this._field.counter
                    };
                    
                    if (isAnimate) {
                        let coordinates = this.startPositionStrategy.get({width: data.width, max: {x: this._field.countX, y: this._field.countY}, x: start.x, y: start.y});
                        params.x = coordinates.x;
                        params.y = coordinates.y;
                        params.destination = {'x': start.x + data.coordinates[i][0], 'y': start.y + data.coordinates[i][1]};
                    
                        this._moveStrategy.startMoving(new Point(params));
                    } else {
                        params.x = start.x + data.coordinates[i][0];
                        params.y = start.y + data.coordinates[i][1];

                        this._field.fillTile(params, params.color);
                    }
                    
                    this._points.push(params);
                }

                start.x += data.width + 1;
            } else {
                start.x += 3;
            }
        }
        
        return this._points;
    }
}