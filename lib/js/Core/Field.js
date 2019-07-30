export default class Field {
    get countX() {return this._countX;}
    get countY() {return this._countY;}
    
    /**
     * @param {string} blockId
     * @param {Array} params
     */
    constructor(blockId, params) {
        let height = document.getElementById(blockId).clientHeight;

        if (params.height) {
            height = params.height;
        } else if (height === 0) {
            height = document.documentElement.clientHeight;
        }

        let width = params.width ? params.width : document.getElementById(blockId).clientWidth;

        this._color = params.color ? params.color : '#ebedf0';
        
        this._id = blockId;
        this._counter = 0;
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
    
    draw() {
        let root = document.getElementById(this._id);
        root.style.overflow = 'hidden';

        for (let y = 0; y < this._countY + 1; y++) {
            let row = document.createElement('div');
            row.classList.add('field-row');

            for (let x = 0; x < this._countX + 1; x++) {
                let div = this._createTile(x, y);
                row.appendChild(div);
            }
            root.appendChild(row);
        }
    }

    _drawBorder() {
        for (let y = 0; y < this._countY; y++) {
            let left = {x: 0, y: y, direction: 39};
            let right = {x: this._countX, y: y, direction: 37};

            this.fillTile(left, 'black');
            this.lockTile(left);
            
            this.fillTile(right, 'black');
            this.lockTile(right);
            
            this._border.push(left);
            this._border.push(right);
        }
        
        for (let x = 0; x < this._countX + 1; x++) {
            let top = {x: x, y: 0, direction: 40};
            let bottom = {x: x, y: this._countY, direction: 38};

            this.fillTile(top, 'black');
            this.lockTile(top);
            
            this.fillTile(bottom, 'black');
            this.lockTile(bottom);
            
            this._border.push(top);
            this._border.push(bottom);
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
     */
    fillTile(p, color) {
        let tile = this.getTile(p);
        tile.style.backgroundColor = color || 'black';
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

        if (o && o.dataset.lock != 1) {
            o.style.backgroundColor = this._color;
        }
        
        n.style.backgroundColor = newPlace.color;

        return true;
    }
    
    cleanAllTiles() {
        for (let y = 0; y < this._countY + 1; y++) {
            for (let x = 0; x < this._countX + 1; x++) {
                this.cleanTile({x: x, y: y})
            }
        }
    }
    
    /**
     * @param {Object} p <p>{x;y}</p>
     */
    getTile(p) {
        // need to check this tile is exist and throw Exception if it is not so
        return document.querySelector(`#${this._id} #c${p.x}-${p.y}`);
    }
    
    getRandomPoint() {
        return {x: parseInt(Math.random() * this._countX), y: parseInt(Math.random() * this._countY)};
    }
    
    getRandomBorderPoint() {
        return this._border[parseInt(Math.random() * this._border.length)];
    }
    
    isBorderAngle(p) {
        return (p.x == 0 || p.x == this._countX) && (p.y == 0 || p.y == this._countY);
    }
}