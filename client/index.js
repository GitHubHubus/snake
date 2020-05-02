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
import TableScore from './view/components/TableScore';
import Input from './view/components/Input';
import socket from './js/Api/WebSocket';

Vue.component('table-score', TableScore);
Vue.component('settings-input', Input);

const v = new Vue({
    el: '#app',
    created() {
        socket.on('refresh', (data) => {
            data.type === this.type && this._updateTop(data.score);
        });
    },
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
        _updateTop(data) {
            this.top = [];

            $.each(data, (key, value) => {
                value.key = key + 1;
                this.top.push(value);
                this.lastScore = value;
            });
        },
        async _resetGame(type) {
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
            
            const response = await api.score.list(type, 10);
            this._updateTop(response.data);
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
                $('#scoreModal').modal('hide');
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