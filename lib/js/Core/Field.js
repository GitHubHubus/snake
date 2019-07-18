class Field {
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
        this.tile = {width: params.tile.width, height: params.tile.height, indent: params.tile.indent};
        
        let startOnLoad = params.startOnLoad !== undefined ? params.startOnLoad : true;
        
        if (startOnLoad) {
            this.draw();
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
        div.style.width = this.tile.width + 'px';
        div.style.height = this.tile.height + 'px';
        div.style.marginRight = this.tile.indent + 'px';
        div.style.marginBottom = this.tile.indent + 'px';
        
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

    /**
     * @param {Object} p <p>{x;y}</p>
     */
    getTile(p) {
        // need to check this tile is exist and throw Exception if it is not so
        return document.getElementById(`c${p.x}-${p.y}`);
    }
    
    getRandomPoint() {
        return {x: parseInt(Math.random() * this._countX), y: parseInt(Math.random() * this._countY)};
    }
}