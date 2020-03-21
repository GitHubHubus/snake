import SnakeGame from './js/SnakeGame/SnakeGame';
import SnakeGame2 from './js/SnakeGame/SnakeGame2';
import SnakeGame4 from './js/SnakeGame/SnakeGame4';
import SnakeGame6 from './js/SnakeGame/SnakeGame6';
import SnakeGame7 from './js/SnakeGame/SnakeGame7';
import EventHelper from './js/SnakeGame/Helper/EventHelper';
import {$,jQuery} from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

let game = null;

document.getElementById('type').addEventListener("change", (e) => {
    game && game.forceEndGame();
    game = null;
    document.getElementById('score').innerHTML = "";
    document.getElementById('main').innerHTML = "";
    
    switch (e.target.value) {
        case '1':
            game = new SnakeGame();
            break;
        case '2':
            game = new SnakeGame2();
            break;
        case '4':
            game = new SnakeGame4();
            break;
        case '6':
            game = new SnakeGame6();
            break;
        case '7':
            game = new SnakeGame7(); 
            break; 
    }
});

document.getElementById('start').addEventListener("click", () => {
    EventHelper.fire('start');
});