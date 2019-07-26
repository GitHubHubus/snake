class Drawer {
    get startPositionStrategy () {return this._startPositionStrategy;}
    set startPositionStrategy (strategy) {this._startPositionStrategy = strategy;}
    
    constructor(params) {
      //  this._moveStrategy = new SearchNearest(this.moveTile.bind(this), this.lockTile.bind(this));
        this._startPositionStrategy = this.getStartPositionStrategy(params.startPositionStrategy);
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
}