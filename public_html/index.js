const START_POINT = 25;
const END_POINT = 13;

var point = {x: 16, y: 20};
let text = 'W';
let field = new Field('main');
let id = 0;

field.strategy = new SearchNearest(field.movePoint, field.lockTile);
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
                    }), 15);
        }
      
        point.x += data.width + 1;
    }
}