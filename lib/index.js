import SnakeGame from './js/SnakeGame/SnakeGame';
import SnakeGame2 from './js/SnakeGame/SnakeGame2';
import SnakeGame4 from './js/SnakeGame/SnakeGame4';
import SnakeGame6 from './js/SnakeGame/SnakeGame6';
import SnakeGame7 from './js/SnakeGame/SnakeGame7';
import EventHelper from './js/SnakeGame/Helper/EventHelper';
import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

let game = null;
const types = {
    1: SnakeGame,
    2: SnakeGame2,
    4: SnakeGame4,
    6: SnakeGame6,
    7: SnakeGame7
};

const ratingRowTemplate = (key, value) => {
    return `<div class="text-center">
        <span class="rating-name ml-2">${key}. ${value.name}</span>
        <span class="rating-score ml-5">${value.score}</span>
    </div>
    <hr />`;
};

const redrawRating = (type) => {
    $('#top #data').empty();
    
    $.ajax({
        url: `http://localhost:8080/top/${type}/10`,
        dataType: 'json',
        success: (response) => {
            $.each(response, (key, value) => {
                $('#top #data').append(ratingRowTemplate(key + 1, value));
            });
        },
        error: (err) => {
            console.log(err);
        }
    });
};

document.getElementById('type').addEventListener("change", (e) => {
    game && game.forceEndGame();
    game = null;
    document.getElementById('score').innerHTML = "";
    document.getElementById('main').innerHTML = "";
    
    game = new types[e.target.value]();
    redrawRating(e.target.value);
});

$.each(types, (key, value) => {
    $('#type').append(`<option value="${key}">${key}</option>`); 
});

document.getElementById('start').addEventListener("click", () => {
    EventHelper.fire('start');
});


