const START_POINT = 25;
const END_POINT = 13;

let field = new Field('main');
field.strategy = new SearchNearest(field.movePointPerforating, field.lockTile);
field.startPositionStrategy = new Left();
field.initTile(10, 10, 2);
field.draw();

field.drawText('HELLO WORLD', {x: 10, y: 20});
setTimeout(function(){field.drawText('OLEG KOCHETKOV', {x: 10, y: 28});}, 4000);


