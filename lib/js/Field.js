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
        this._bindedPoints = [];
        
        let startOnLoad = params.startOnLoad !== undefined ? params.startOnLoad : true;
        
        if (startOnLoad) {
            this.draw();
        }
    }
    
    getMoveStrategy(name) {
        switch (name) {
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
            let row = this._createRow();

            for (let x = 0; x < this._countX + 1; x++) {
                let div = this._createTile(x, y);
                row.appendChild(div);
            }
            root.appendChild(row);
        }
    }
    
    _createRow() {
        let row = document.createElement('div');
        row.classList.add('field-row');

        return row;
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

    fillNode(point) {
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
    
    drawText(text, startPoint) {
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
                    
                    this.moveStrategy.startMoving(new Point(params));
                }

                point.x += data.width + 1;
            } else {
                point.x += 3;
            }
        }
    }

    createPoint (options) {
        options.id = ++this._counter;

        if (!options.departure) {
            options.departure = this.startPositionStrategy.getPosition({width: 0, max: {x: this._countX, y: this._countY}, x: 0, y: 0});
        }

        if (!options.color) {
            let color = parseInt(Math.random() * this.tile.colors.length);
            options.color = this.tile.colors[color];
        }

        if (!options.destination) {
           options.destination = this.startPositionStrategy.getPosition({width: 0, max: {x: this._countX, y: this._countY}, x: 0, y: 0}); 
        }

        return new Point(options);
    }
    
    movePointForce(point) {
        this.moveStrategy.startMoving(point);
    }
    
    movePoint(point) {
        if (point.stoped && (!point.inPlace(true) || !point.inPlace(false))) {
            point.stoped = false;
            this.moveStrategy.startMoving(point);
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
                    
                    this.fillNode(new Point(params));
                }

                point.x += data.width + 1;
            } else {
                point.x += 3;
            }
        }
    }
    
    bindPoints (points) {
        let self = this;
        let nodes = document.querySelectorAll('div.field-node');
        
        points.forEach((p) => {
            this.movePointForce(p);
            this._bindedPoints.push(p);
        });

        nodes.forEach(function (element) {
            element.addEventListener('mouseenter', function (e) {
                self._bindedPoints.forEach((point) => {
                    point.destination = {
                        x: parseInt(e.target.dataset.x),
                        y: parseInt(e.target.dataset.y)
                    };
        
                    self.unlockTile(point);
                    self.movePoint(point);
                });
            }, false);
        });
    }
}