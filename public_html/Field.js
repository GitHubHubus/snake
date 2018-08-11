class Field {
    get countX () {return this._countX;}
    get countY () {return this._countY;}
    set countX (w) {this._countX = w;}
    set countY (h) {this._countY = h;}
    get strategy () {return this._strategy;}
    set strategy (strategy) {this._strategy = strategy;}
    get startPositionstrategy () {return this._startPositionStrategy;}
    set startPositionstrategy (startPositionstrategy) {this._startPositionStrategy = startPositionstrategy;}
    
    constructor(blockId, width, height) {
        this.width = width ? width : document.documentElement.clientWidth;
        this.height = height ? height : document.documentElement.clientHeight;
        this.id = blockId;
        this._counter = 0;
    }
    
    draw() {
        let root = document.getElementById(this.id);
        root.style.overflow = 'hidden';
        for (let y = 0; y < parseInt(this.countY) + 1; y++) {
            let node = document.createElement('div');
            node.style.margin = 0;
            node.style.padding = 0;
            node.style.lineHeight = 0;
            node.style.whiteSpace = 'nowrap';
            for (let x = 0; x < parseInt(this.countX) + 1; x++) {
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
                
                div.style.backgroundColor = this.color;
                div.style.width = this.tile.width + 'px';
                div.style.height = this.tile.height + 'px';
                div.style.marginRight = this.tile.indent + 'px';
                div.style.marginBottom = this.tile.indent + 'px';
                
                node.appendChild(div);
            }
            root.appendChild(node);
        }
    }
    
    initTile(width, height, indent, color) {
        this.color = color ? color : '#ebedf0';
        this.countX = parseInt(this.width / (width + indent));
        this.countY = parseInt(this.height / (height + indent));
        this.tile = {width: width, height: height, indent: indent, color: color};
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
    
    drawText(text, startPoint) {
        let point = startPoint;
        
        for(var char in text) {
            let data = alphabet[text[char]];
            if (data) {
                for (let i in data.coordinates) {
                    let params = this.startPositionStrategy.getPosition({width: data.width, max: {x: this.countX, y: this.countY}, x: point.x, y: point.y})
                    params.color = 'rgb(123, 201, 111)';
                    params.id = ++this._counter;
                    params.destination = {'x': point.x + data.coordinates[i][0], 'y': point.y - data.coordinates[i][1]};
                    
                    this.strategy.startMoving(new Point(params), 50);
                }

                point.x += data.width + 1;
            } else {
                point.x += 3;
            }
        }
    }
}