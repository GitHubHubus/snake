let field = new Field('main', {tile: {width: 10, height: 10, indent: 1, colors: ['red']}});

//field.drawText('HELLO', {x: 1, y: 5}, 20);
//field.startPositionStrategy = new Left();
//field.drawText('WORLD', {x: 22, y: 36}, 20);
//setTimeout(function(){field.drawText('WORLD', {x: 1, y: 15});}, 500);

let point = field.createPoint();

let nodes = document.querySelectorAll('div.field-node');
field.movePointForce(point, 40);

nodes.forEach(function (element) {
    element.addEventListener('mouseenter', function (e) {
        point.destination = {
            x: parseInt(e.target.dataset.x),
            y: parseInt(e.target.dataset.y)
        };
        
        field.unlockTile(point, 40);
        field.movePoint(point, 40);
    }, false);
});
