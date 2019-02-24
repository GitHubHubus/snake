let field = new Field('main', {tile: {width: 5, height: 5, indent: 1, colors: ['red']}});
field.draw();

field.drawText('HELLO', {x: 1, y: 5}, 20);
//field.startPositionStrategy = new Left();
//field.drawText('WORLD', {x: 22, y: 36}, 20);
setTimeout(function(){field.drawText('WORLD', {x: 1, y: 15});}, 500);
