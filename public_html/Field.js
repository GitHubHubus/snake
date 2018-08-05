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
        for (let x = 0; x < parseInt(this.countY) + 1; x++) {
            let node = document.createElement('div');
            node.style.margin = 0;
            node.style.padding = 0;
            node.style.lineHeight = 0;
            node.style.whiteSpace = 'nowrap';
            for (let y = 0; y < parseInt(this.countX) + 1; y++) {
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
        let div = document.getElementById('c' + newC.x + newC.y);
        if (div) {
            if (div.style.backgroundColor === 'green') {
                return false;
            }
            
            div.style.backgroundColor = newC.color;
        }
        
        div = document.getElementById('c' + oldC.x + oldC.y);
        if (div) {
            div.style.backgroundColor = '#ebedf0';
        }
        
        return true;
    }
}