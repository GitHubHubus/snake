class Field {
    get moveStrategy () {return this._moveStrategy;}
    set moveStrategy (strategy) {this._moveStrategy = strategy;}
    get startPositionStrategy () {return this._startPositionStrategy;}
    set startPositionStrategy (strategy) {this._startPositionStrategy = strategy;}
    
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
        this._moveStrategy = this.getMoveStrategy(params.moveStrategy);
        this._startPositionStrategy = this.getStartPositionStrategy(params.startPositionStrategy);
        this._counter = 0;
        this._countX = parseInt(width / (params.tile.width + params.tile.indent));
        this._countY = parseInt(height / (params.tile.height + params.tile.indent));
        this.tile = {width: params.tile.width, height: params.tile.height, indent: params.tile.indent, colors: colors};
    }
    
    getMoveStrategy(name) {
        switch (name) {
            case 'simple':
                return new Simple(this.movePointPerforating, this.lockTile);
            case 'search-nearest':
            default:
                return new SearchNearest(this.movePointPerforating, this.lockTile);
        }
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
        div.classList.add('node');
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
    
    unlockTile(p) {
        let tile = document.getElementById('c' + p.x + '-' + p.y);
        tile.dataset.lock = 0;
        tile.dataset.id = null;
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

    fillPoint(point) {
        let p = document.getElementById('c' + point.x + '-' + point.y);
        p.style.backgroundColor = point.color;
    }

    movePointPerforating(currentPlace, newPlace) {
        let n = document.getElementById('c' + newPlace.x + '-' + newPlace.y);
        let o = document.getElementById('c' + currentPlace.x + '-' + currentPlace.y);
        
        if (!n || !n.style) {
            return false;
        }

        if (o && o.dataset.lock != 1) {
            o.style.backgroundColor = '#ebedf0';
        }
        
        n.style.backgroundColor = newPlace.color;

        return true;
    }
    
    drawText(text, startPoint, frequency) {
        let point = startPoint;
        
        for(var char in text) {
            let data = symbols[text[char]];
            if (data) {
                for (let i in data.coordinates) {
                    let color = parseInt(Math.random() * this.tile.colors.length);
                    let params = this.startPositionStrategy.getPosition({width: data.width, max: {x: this._countX, y: this._countY}, x: point.x, y: point.y})
                    params.color = this.tile.colors[color];
                    params.id = ++this._counter;
                    params.destination = {'x': point.x + data.coordinates[i][0], 'y': point.y - data.coordinates[i][1]};
                    
                    this.moveStrategy.startMoving(new Point(params), frequency);
                }

                point.x += data.width + 1;
            } else {
                point.x += 3;
            }
        }
    }

    createPoint (startPoint, endPoint) {
        let color = parseInt(Math.random() * this.tile.colors.length);
        let params = startPoint || {x: 0, y: 0};

        params.color = this.tile.colors[color];
        params.id = ++this._counter;
        params.destination = endPoint;
        
        return new Point(params);
    }
    
    movePointForce(point, frequency) {
        this.moveStrategy.startMoving(point, frequency);
    }
    
    movePoint(point, frequency) {
        if (point.stoped && (!point.inPlace(true) || !point.inPlace(false))) {
            point.stoped = false;
            this.moveStrategy.startMoving(point, frequency);
        }
    }
    
    drawSimpleText(text, startPoint) {
        let point = startPoint;
        
        for(var char in text) {
            let data = symbols[text[char]];
            if (data) {
                for (let i in data.coordinates) {
                    let color = parseInt(Math.random() * this.tile.colors.length);
                    
                    let params = {
                        'x': point.x + data.coordinates[i][0], 
                        'y': point.y - data.coordinates[i][1],
                        id : ++this._counter,
                        color : this.tile.colors[color]
                    
                    };
                    
                    this.fillPoint(new Point(params));
                }

                point.x += data.width + 1;
            } else {
                point.x += 3;
            }
        }
    }
}