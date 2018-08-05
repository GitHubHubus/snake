class Field {
    
    get countX () {return this._countX;}
    get countY () {return this._countY;}
    set countX (w) {this._countX = w;}
    set countY (h) {this._countY = h;}
    
    constructor(blockId, width, height) {
        this.width = width ? width : document.documentElement.clientWidth;
        this.height = height ? height : document.documentElement.clientHeight;
        this.id = blockId;
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
                div.id = 'c' + x + y;
                div.dataset.x = x;
                div.dataset.y = y;
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
        this.countX = this.width / (width + indent);
        this.countY = this.height / (height + indent);
        this.tile = {width: width, height: height, indent: indent, color: color};
    }
    
    movePoint(oldC, newC) {
        let n = document.getElementById('c' + newC.x + newC.y);
        let o = document.getElementById('c' + oldC.x + oldC.y);

        if (!n || n.dataset.lock == 1 || n.style.backgroundColor === 'green' || (o && o.dataset.lock == 1)) {
            return false;
        }
        
        n.dataset.lock = 1;
        o.dataset.lock = 1;

        n.style.backgroundColor = newC.color;
        o.style.backgroundColor = '#ebedf0';

        n.dataset.lock = 0;
        o.dataset.lock = 0;
        return true;
    }
}