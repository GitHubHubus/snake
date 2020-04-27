import SnakeGame from './js/SnakeGame/SnakeGame';
import SnakeGame2 from './js/SnakeGame/SnakeGame2';
import SnakeGame4 from './js/SnakeGame/SnakeGame4';
import SnakeGame6 from './js/SnakeGame/SnakeGame6';
import SnakeGame7 from './js/SnakeGame/SnakeGame7';
import EventHelper from './js/SnakeGame/Helper/EventHelper';
import SETTINGS from '../settings';
import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

let game = null;
let lastScore = {};
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

const handleEndGame = () => {
    if (!lastScore.value || (game.score() > lastScore.value || lastScore.key < 10)) {
        console.log(game);
        $('input[name="score"]').val(game.score());
        console.log(123);
        $('#scoreModal').modal({show: true});
    }
};

const redrawRating = (type) => {
    $('#top #data').empty();
    
    $.ajax({
        url: `${SETTINGS.api_url}/top/${type}/10`,
        dataType: 'json',
        contentType: 'Content-Type: application/x-www-form-urlencoded',
        success: (response) => {
            $.each(response, (key, value) => {
                $('#top #data').append(ratingRowTemplate(key + 1, value));
                lastScore = {value: value, key: key};
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
    
    game = new types[e.target.value]({onEndGame: handleEndGame});
    redrawRating(e.target.value);
    $('input[name="type"]').val(e.target.value);
});

$.each(types, (key, value) => {
    $('#type').append(`<option value="${key}">${key}</option>`); 
});

document.getElementById('start').addEventListener("click", () => {
    EventHelper.fire('start');
});

$('#score-submit').on('click', (e) => {
    let data = {};

    $.each($('.score-form').find('input'), (key, input) => {
        data[$(input).attr('name')] = $(input).val();
    });

    $.ajax({
        url: `${SETTINGS.api_url}/score`,
        data: data,
        type: 'POST',
        success: (response) => {
            redrawRating(data.type);
            $('#scoreModal').modal({show: false});
        }
    })
});
