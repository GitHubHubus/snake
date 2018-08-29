let field = new Field('main', {tile: {width: 10, height: 10, indent: 2}});
field.strategy = new SearchNearest(field.movePointPerforating, field.lockTile);
field.startPositionStrategy = new Left();
field.draw();

field.drawText('HELLO WORLD', {x: 28, y: 28}, 20);
field.startPositionStrategy = new Left();
field.drawText('OLEG KOCHETKOV', {x: 22, y: 36}, 20);
//setTimeout(function(){field.drawText('OLEG KOCHETKOV', {x: 10, y: 28});}, 500);


