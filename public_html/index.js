const START_POINT = 25;
const END_POINT = 13;

var point = {x: 16, y: 20};
let text = 'O';
let field = new Field('main');
let id = 0;
let length = 0;

field.strategy = new Simple(field.movePoint, field.lockTile);
field.initTile(15, 15, 2);
field.draw();

for(var char in text) {
    let data = alphabet[text[char]];
    if (data) {
        for (let i in data.coordinates) {
            field.strategy.startMoving(
                    new Point({
                        'x': parseInt(Math.random() * field.countX),
                        'y': parseInt(Math.random() * field.countY), 
                        'color': 'yellow', 
                        'id': ++id,
                        'destination': {'x': point.x + data.coordinates[i][0], 'y': point.y - data.coordinates[i][1]}
                    }), 150);
        }
      
        length += data.width;
        point.x += length + 1;
    }
}