export const DEFAULT_TILE_SIZE = {width: 10, height: 10, indent: 1};

export class Field {
    get countX() {return this._countX;}
    get countY() {return this._countY;}
    get color() {return this._color;}

    /**
     * @param {string} blockId
     * @param {Object} params
     */
    constructor(blockId, params= {}) {
        this._block = document.querySelector(`div#${blockId}`);
        let height = this._block.clientHeight;
        this._data = {};
        
        if (params.height) {
            height = params.height;
        } else if (height === 0) {
            height = document.documentElement.clientHeight;
        }

        let width = params.width ? params.width : this._block.clientWidth;

        this._color = params.color ? params.color : '#ebedf0';
        this._countX = parseInt(width / (params.tile.width + params.tile.indent));
        this._countY = parseInt(height / (params.tile.height + params.tile.indent));
        this._tile = params.tile;
        
        let startOnLoad = params.startOnLoad !== undefined ? params.startOnLoad : true;
        this._border = [];
        
        if (startOnLoad) {
            this.draw();
        }
        
        if (params.border === true) {
            this._drawBorder();
        }
    }

    destroy() {
        this._block.innerHTML = "";
    }

    draw() {
        this._block.style.overflow = 'hidden';

        for (let y = 0; y < this._countY + 1; y++) {
            let row = document.createElement('div');
            row.classList.add('field-row');

            for (let x = 0; x < this._countX + 1; x++) {
                let div = this._createTile(x, y);
                row.appendChild(div);
                this._data[div.id] = div;
            }
            this._block.appendChild(row);
        }
    }

    _drawBorder() {
        for (let y = 0; y < this._countY; y++) {
            let left = {x: 0, y: y, direction: 39};
            let right = {x: this._countX, y: y, direction: 37};

            this._createBorderTile(left);
            this._createBorderTile(right);
        }
        
        for (let x = 0; x < this._countX + 1; x++) {
            let top = {x: x, y: 0, direction: 40};
            let bottom = {x: x, y: this._countY, direction: 38};

            this._createBorderTile(top);
            this._createBorderTile(bottom);
        }
    }

    isBorder(p) {
        for (let i in this._border) {
            if (this._border[i].x == p.x && this._border[i].y == p.y) {
                return true;
            }
        }
        
        return false;
    }
    
    _createBorderTile(tile, color = 'black') {
        this.fillTile(tile, color);
        this.lockTile(tile);
        this._border.push(tile);
    }
    
    /**
     * 
     * @param {int} x
     * @param {int} y
     * @returns {Element}
     */
    _createTile(x, y) {
        let div = document.createElement('div');

        div.id = 'c' + x + '-' + y;
        div.classList.add('field-node');
        div.dataset.x = x;
        div.dataset.y = y;
        div.dataset.id = 'empty';

        div.style.backgroundColor = this._color;
        div.style.width = this._tile.width + 'px';
        div.style.height = this._tile.height + 'px';
        div.style.marginRight = this._tile.indent + 'px';
        div.style.marginBottom = this._tile.indent + 'px';

        return div;
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     * @returns {Boolean}
     */
    isLockTile(p) {
        let tile = this.getTile(p);

        return tile.dataset.lock == 1;
    }

    isExistTile(p) {
        return this.getTile(p) !== null;
    }

    /**
     * @param {Object} p <p>{x;y}</p>
     */
    lockTile(p) {
        let tile = this.getTile(p);
        tile.dataset.lock = 1;
        tile.dataset.id = p.id || null;
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     */
    unlockTile(p) {
        let tile = this.getTile(p);
        tile.dataset.lock = 0;
        tile.dataset.id = null;
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     * @param {String} color
     * @param {Boolean} isLock
     */
    fillTile(p, color, isLock = false) {
        let tile = this.getTile(p);
        tile.style.backgroundColor = color || 'black';

        isLock && this.lockTile(p);
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     */
    cleanTile(p) {
        let tile = this.getTile(p);
        tile.style.backgroundColor = this._color;
    }
    
    /**
     * @param {Object} currentPlace <p>{x;y}</p>
     * @param {Object} newPlace <p>{x;y}</p>
     */
    moveTile(currentPlace, newPlace) { //move this somewhere
        let n = this.getTile(newPlace);
        let o = this.getTile(currentPlace);
        
        if (!n || !n.style) {
            return false;
        }

        if (o && o.dataset.lock !== 1) {
            o.style.backgroundColor = this._color;
        }
        
        n.style.backgroundColor = newPlace.color;

        return true;
    }
    
    cleanAllTiles() {
        for (let i in this._data) {
            this._data[i].style.backgroundColor = this._color;
        }
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     */
    getTile(p) {
        return this._data[`c${p.x}-${p.y}`];
    }
    
    getRandomPoint() {
        return {x: parseInt(Math.random() * this._countX), y: parseInt(Math.random() * this._countY)};
    }
    
    getRandomBorderPoint() {
        return this._border[parseInt(Math.random() * this._border.length)];
    }
    
    isBorderAngle(p) {
        return (p.x === 0 || p.x === this._countX) && (p.y === 0 || p.y === this._countY);
    }

    getCenterPoint(shift) {
        return {x: Math.round(this._countX/2 + shift.x), y: Math.round(this._countY/2 + shift.y)};
    }

    getCountTiles() {
        return (this._countY * this._countX) - this._border.length;
    }
}