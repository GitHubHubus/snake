class Field {
    get strategy () {return this._strategy;}
    set strategy (strategy) {this._strategy = strategy;}
    get startPositionStrategy () {return this._startPositionStrategy;}
    set startPositionStrategy (strategy) {this._startPositionStrategy = strategy;}
    
    constructor(blockId, params) {
        let width = params.width ? params.width : document.documentElement.clientWidth;
        let height = params.height ? params.height : document.documentElement.clientHeight;
        this._color = params.color ? params.color : '#ebedf0';
        let color = params.tile.color ? params.tile.color : ['rgb(123, 201, 111)', '#196127', '#c6e48b'];
        
        this._id = blockId;
        this._counter = 0;
        this._countX = parseInt(width / (params.tile.width + params.tile.indent));
        this._countY = parseInt(height / (params.tile.height + params.tile.indent));
        this.tile = {width: params.tile.width, height: params.tile.height, indent: params.tile.indent, color: color};
    }
    
    draw() {
        let root = document.getElementById(this._id);
        root.style.overflow = 'hidden';

        for (let y = 0; y < this._countY + 1; y++) {
            let node = this.createNode();

            for (let x = 0; x < this._countX + 1; x++) {
                let div = this.createTileBlock(x, y);
                node.appendChild(div);
            }
            root.appendChild(node);
        }
    }
    
    createNode() {
        let node = document.createElement('div');
        node.style.margin = 0;
        node.style.padding = 0;
        node.style.lineHeight = 0;
        node.style.whiteSpace = 'nowrap';
            
        return node;
    }
    
    createTileBlock (x, y) {
        let div = document.createElement('div');
        div.id = 'c' + x + '-' + y;
        div.dataset.x = x;
        div.dataset.y = y;
        div.dataset.id = 'empty';
        
        //dev
        div.style.textAlign = 'center';
        div.style.lineHeight = '2.7';
        div.style.fontSize = '10px';
        div.style.color = 'red';
        div.style.display = 'inline-block';
        
        div.style.backgroundColor = this._color;
        div.style.width = this.tile.width + 'px';
        div.style.height = this.tile.height + 'px';
        div.style.marginRight = this.tile.indent + 'px';
        div.style.marginBottom = this.tile.indent + 'px';
        
        return div;
    }
    
    lockTile(p) {
        let tile = document.getElementById('c' + p.x + '-' + p.y);
        tile.dataset.lock = 1;
        tile.dataset.id = p.id;
    }
    
    movePoint(currentPlace, newPlace) {
        let n = document.getElementById('c' + newPlace.x + '-' + newPlace.y);
        let o = document.getElementById('c' + currentPlace.x + '-' + currentPlace.y);

        if (!n || n.dataset.lock == 1 || n.dataset.id != 'empty') {
            return false;
        }
        
        n.dataset.lock = 1;

        n.style.backgroundColor = newPlace.color;
        n.dataset.id = newPlace.id;
     //   n.innerHTML = newPlace.id;
        
        o.style.backgroundColor = '#ebedf0';
        o.dataset.id = 'empty';
     //   o.innerHTML = '';

        o.dataset.lock = 0;

        return true;
    }
    
    movePointPerforating(currentPlace, newPlace) {
        let n = document.getElementById('c' + newPlace.x + '-' + newPlace.y);
        let o = document.getElementById('c' + currentPlace.x + '-' + currentPlace.y);

        if (o && o.dataset.lock != 1) {
            o.style.backgroundColor = '#ebedf0';
        }
        
        n.style.backgroundColor = newPlace.color;

        return true;
    }
    
    drawText(text, startPoint, frequency) {
        let point = startPoint;
        
        for(var char in text) {
            let data = alphabet[text[char]];
            if (data) {
                for (let i in data.coordinates) {
                    let color = parseInt(Math.random() * this.tile.color.length);
                    let params = this.startPositionStrategy.getPosition({width: data.width, max: {x: this._countX, y: this._countY}, x: point.x, y: point.y})
                    params.color = this.tile.color[color];
                    params.id = ++this._counter;
                    params.destination = {'x': point.x + data.coordinates[i][0], 'y': point.y - data.coordinates[i][1]};
                    
                    this.strategy.startMoving(new Point(params), frequency);
                }

                point.x += data.width + 1;
            } else {
                point.x += 3;
            }
        }
    }
}