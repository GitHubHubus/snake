const START_POINT = 25;
const END_POINT = 13;
var point = {x: 20, y: 20};
let startTextPointX = 20;
let startTextPointY = 10;
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

field.initTile(10, 10, 2);
field.draw();

length = 0;
point.x = ++startTextPointX;

for(var char in text) {
    let data = alphabet[text[char]];
    if (data) {
        for (let i in data.coordinates) {
            let coordinates = [point.x + data.coordinates[i][0], point.y - data.coordinates[i][1]];
            let point2 = new Point(parseInt(Math.random() * field.countX), parseInt(Math.random() * field.countY), 'green');
            
            point2.moveDestination(coordinates[0], coordinates[1], 100, field.movePoint);
        }
      
        length += data.width;
        addSpace(data.width);
    }
}