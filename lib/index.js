import SnakeGame from './js/SnakeGame/SnakeGame';
import SnakeGame2 from './js/SnakeGame/SnakeGame2';
import SnakeGame4 from './js/SnakeGame/SnakeGame4';
import SnakeGame6 from './js/SnakeGame/SnakeGame6';
import SnakeGame7 from './js/SnakeGame/SnakeGame7';

document.addEventListener("click", () => {
    const type = document.getElementById('type').value;
    let game = null
    
    switch (type) {
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