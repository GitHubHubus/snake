import SnakeGame from './Games/SnakeGame';
import SnakeGame2 from './Games/SnakeGame2';
import SnakeGame3 from './Games/SnakeGame3';
import SnakeGame4 from './Games/SnakeGame4';
import SnakeGame5 from './Games/SnakeGame5';
import SnakeGame6 from './Games/SnakeGame6';
import SnakeGame7 from './Games/SnakeGame7';
import SnakeGame8 from './Games/SnakeGame8';
import PvpSnakeGame from './Games/PvpSnakeGame';

const games = {
    [SnakeGame.id()]: SnakeGame,
    [SnakeGame2.id()]: SnakeGame2,
    [SnakeGame3.id()]: SnakeGame3,
    [SnakeGame4.id()]: SnakeGame4,
    [SnakeGame5.id()]: SnakeGame5,
    [SnakeGame6.id()]: SnakeGame6,
    [SnakeGame7.id()]: SnakeGame7,
    [SnakeGame8.id()]: SnakeGame8,
    [PvpSnakeGame.id()]: PvpSnakeGame
};

export default games;
