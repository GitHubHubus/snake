import SnakeGame from './js/SnakeGame/SnakeGame';
import SnakeGame2 from './js/SnakeGame/SnakeGame2';
import SnakeGame4 from './js/SnakeGame/SnakeGame4';
import SnakeGame6 from './js/SnakeGame/SnakeGame6';
import SnakeGame7 from './js/SnakeGame/SnakeGame7';
import EventHelper from './js/SnakeGame/Helper/EventHelper';
import $ from 'jquery'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/pixel.css';
import Vue from 'vue';
import api from './js/Api/index';

Vue.component('rating-row', {
    props: {
        score: Object,
    },
    template: `<div class="text-center">
                <div>
                    <span class="rating-name ml-2">{{score.key}}</span>
                    <span class="rating-name ml-2">{{score.name}}</span>
                    <span class="rating-score ml-5">{{score.score}}</span>
                </div>
            </div>`
});

var a = new Vue({
    el: '#app',
    data: {
        top: [],
        lastScore: null,
        score: 0,
        type: null,
        description: '',
        name: '',
        games: [
            {value: SnakeGame, text: SnakeGame.description()},
            {value: SnakeGame2, text: SnakeGame2.description()},
            {value: SnakeGame4, text: SnakeGame4.description()},
            {value: SnakeGame6, text: SnakeGame6.description()},
            {value: SnakeGame7, text: SnakeGame7.description()},
        ],
        game: null
    },
    methods: {
        changeGame(e) {
            this.type = e.target.value;
            this.description = this.type;
            this._resetGame(this.type);
        },
        _redrawRating(type) {
            let that = this;
            that.top = [];

            api.score.list(type, 10).then((response) => {
                $.each(response.data, (key, value) => {
                    value.key = key + 1;
                    that.top.push(value);
                    that.lastScore = value;
                });
            });
        },
        _resetGame(type) {
            if (this.game) {
                this.game.forceEndGame();
                this.game.destroyView();
                this.game = null;
            }

            for (let i =0; i < this.games.length; i++) {
                if (this.games[i].text === type) {
                    this.game = new this.games[i].value({onEndGame: this._handleEndGame});
                    break;
                }
            }

            this._redrawRating(type);
        },
        _handleEndGame() {
            if (
                this.game.score() > 0 &&
                (!this.lastScore || this.game.score() > this.lastScore.score || this.lastScore.key < 10)
            ) {
                this.score = this.game.score();
                $('#scoreModal').modal({show: true});
            }
        },
        postScore() {
            let data = {score: this.score, type: this.type, name: this.name};

            api.score.post(data).then((response) => {
                this._redrawRating(data.type);
                $('#scoreModal').modal('hide');
            });
        },
        startGame() {
            if (this.game) {
                this._resetGame(this.type);
            }

            EventHelper.fire('start');
        }
    }
});