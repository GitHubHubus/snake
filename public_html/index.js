const START_POINT = 25;
const END_POINT = 13;
var point = {x: 20, y: 20};
let startTextPointX = 16;
let startTextPointY = 6;
let text = 'O';
let field = new Field('main');

/**
 * @param {int} space
 * @return int 
 */
function addSpace(space) {
  space += 1;
  point.x += space;
  return point.x;
};

field.initTile(15, 15, 2);
field.draw();

length = 0;
point.x = ++startTextPointX;

let id = 0;
for(var char in text) {
    let data = alphabet[text[char]];
    if (data) {
        for (let i in data.coordinates) {
            id++;
            let coordinates = [point.x + data.coordinates[i][0], point.y - data.coordinates[i][1]];
            let point2 = new Point(parseInt(Math.random() * field.countX), parseInt(Math.random() * field.countY), 'yellow', id);
            
            point2.moveDestination(coordinates[0], coordinates[1], 350, field.movePoint, field.lockTile);
        }
      
        length += data.width;
        addSpace(data.width);
    }
}