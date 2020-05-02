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
import RowScore from './view/components/RowScore';
import Input from './view/components/Input';
import io from 'socket.io-client';

Vue.component('row-score', RowScore);
Vue.component('settings-input', Input);

const socket = io('http://0.0.0.0:8080/top');
socket.on('refresh', (data) => {
  console.log(data);
});

const v = new Vue({
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
        game: null,
        gameObject: null,
        settings: {},
        settingsValues: {}
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
            if (this.gameObject) {
                this.gameObject.forceEndGame();
                this.gameObject.destroyView();
                this.gameObject = null;
            }

            for (let i = 0; i < this.games.length; i++) {
                if (this.games[i].text === type) {
                    this.settings = this.games[i].value.settings();
                    this.game = this.games[i].value;
                    break;
                }
            }

            this._redrawRating(type);
        },
        _handleEndGame() {
            if (
                this.gameObject.score() > 0 &&
                (!this.lastScore || this.gameObject.score() > this.lastScore.score || this.lastScore.key < 10)
            ) {
                this.score = this.gameObject.score();
                $('#scoreModal').modal({show: true});
            }
        },
        postScore() {
            let data = {score: this.score, type: this.type, name: this.name};

            api.score.post(data).then((response) => {
                this._redrawRating(data.type);
                $('#scoreModal').modal('hide');

                socket.emit('top', {type: this.type});
            });
        },
        startGame() {
            if (this.gameObject) {
                this._resetGame(this.type);
            }

            this.gameObject = new this.game({onEndGame: this._handleEndGame, settings: this.settingsValues});

            EventHelper.fire('start');
        },
        changeSettings(e) {
            this.settingsValues[e[0]] = e[1];
        }
    }
});