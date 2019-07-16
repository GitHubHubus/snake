class Field {
    constructor(blockId, params) {
        let height = document.getElementById(blockId).clientHeight;

        if (params.height) {
            height = params.height;
        } else if (height === 0) {
            height = document.documentElement.clientHeight;
        }

        let width = params.width ? params.width : document.getElementById(blockId).clientWidth;

        this._color = params.color ? params.color : '#ebedf0';
        let colors = params.tile.colors ? params.tile.colors : ['rgb(123, 201, 111)', '#196127', '#c6e48b'];
        
        this._id = blockId;
        this._counter = 0;
        this._countX = parseInt(width / (params.tile.width + params.tile.indent));
        this._countY = parseInt(height / (params.tile.height + params.tile.indent));
        this.tile = {width: params.tile.width, height: params.tile.height, indent: params.tile.indent, colors: colors};
        
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
    
    isLockTile(p) {
        let tile = this.getTile(p);

        return tile.dataset.lock == 1;
    }
    
    lockTile(p) {
        let tile = this.getTile(p);
        tile.dataset.lock = 1;
        tile.dataset.id = p.id || null;
    }
    
    unlockTile(p) {
        let tile = this.getTile(p);
        tile.dataset.lock = 0;
        tile.dataset.id = null;
    }

    fillTile(p) {
        let tile = this.getTile(p);
        tile.style.backgroundColor = p.color || 'black';
    }

    cleanTile(p) {
        let tile = this.getTile(p);
        tile.style.backgroundColor = this._color;
    }

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

    getTile(p) {
        // need to check this tile is exist and throw Exception if it is not so
        return document.getElementById(`c${p.x}-${p.y}`);
    }
    
    getRandomPoint() {
        return {x: parseInt(Math.random() * this._countX), y: parseInt(Math.random() * this._countY)};
    }
    
    getRandomColor() {
        return this.tile.colors[parseInt(Math.random() * this.tile.colors.length)];
    }
}