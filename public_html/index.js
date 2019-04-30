let field = new Field('main', {tile: {width: 10, height: 10, indent: 1, colors: ['red']}});
field.draw();

//field.drawText('HELLO', {x: 1, y: 5}, 20);
//field.startPositionStrategy = new Left();
//field.drawText('WORLD', {x: 22, y: 36}, 20);
//setTimeout(function(){field.drawText('WORLD', {x: 1, y: 15});}, 500);

let point = field.createPoint({x: 0, y: 0}, {x: 50, y: 50});
let point2 = field.createPoint({x: 30, y: 0}, {x: 50, y: 50});

let nodes = document.querySelectorAll('div.node');
field.movePoint(point, 40);
field.movePoint(point2, 50);

nodes.forEach(function (element) {
    element.addEventListener('mouseenter', function (e) {
        point.destination = {x: e.target.dataset.x, y: e.target.dataset.y};
        point2.destination = {x: e.target.dataset.x, y: e.target.dataset.y};
    }, false);
});
