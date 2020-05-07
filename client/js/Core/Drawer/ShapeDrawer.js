import Drawer from './Drawer';

export default class ShapeDrawer extends Drawer {
    /**
     * @param {Object} params
     */
    constructor(params) {
        super(params);
        this._field = params.field;
        this._colors = params.colors || ['orange'];
        this._points = params.points || [];
        this._available = [];
    }

    /**
     * @param {Object} startPoint <p>{x; y}</p>
     * @param {Number} length
     * @return {Array}
     */
    draw(startPoint, length) {
        this._points = [];
        this._addPoint(startPoint);

        while(length > this._points.length) {
            let point = this._getRandomAvailablePoint();
            this._addPoint(point);
        }

        return this._points;
    }

    /**
     * @param {Object} point <p>{x; y}</p>
     */
    _addPoint(point) {
        point.color = this._colors[0];

        this._field.fillTile(point, point.color);
        this._field.lockTile(point);
        this._points.push(point);
    }

    _getRandomAvailablePoint() {
        this._available = [];
        let around = [{x:-1, y: -1}, {x:0, y: -1}, {x: 1, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}];

        for (let i = 0; i < this._points.length; i++) {
            let p = this._points[i];
            for (let j = 0; j < around.length; j++) {
                let newPoint = {x: p.x + around[j].x, y: p.y + around[j].y};

                if (!this._field.isBorder(newPoint) && !this._isExistPoint(newPoint) && !this._isAvailablePoint(newPoint)) {
                    this._available.push(newPoint);
                }
            }
        }

        return this._available[parseInt(Math.random() * this._available.length)];
    }

    _isExistPoint(p) {
        for (let i in this._points) {
            if (this._points[i].x == p.x && this._points[i].y == p.y) {
                return true;
            }
        }

        return false;
    }

    _isAvailablePoint(p) {
        for (let i in this._available) {
            if (this._available[i].x == p.x && this._available[i].y == p.y) {
                return true;
            }
        }

        return false;
    }
}
