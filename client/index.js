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
import './i18n';
import i18next from 'i18next';

Vue.component('table-score', TableScore);
Vue.component('settings-input', Input);

const v = new Vue({
    el: '#app',
    created() {
        socket.on('refresh', (data) => {
            data.type === this.type && this._updateTop(data.score);
        });
        
        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

        this._recreateGame();
    },
    data: {
        top: [],
        lastScore: null,
        score: 0,
        type: SnakeGame.description(),
        name: '',
        description: SnakeGame.description(),
        rules: SnakeGame.rules(),
        rating: true,
        games: [
            {value: SnakeGame, text: SnakeGame.description()},
            {value: SnakeGame2, text: SnakeGame2.description()},
            {value: SnakeGame4, text: SnakeGame4.description()},
            {value: SnakeGame6, text: SnakeGame6.description()},
            {value: SnakeGame7, text: SnakeGame7.description()},
        ],
        game: SnakeGame,
        gameObject: null,
        settings: SnakeGame.settings(),
        settingsValues: {}
    },
    methods: {
        changeGame(e) {
            this.type = e.target.value;
            this.description = this.type;
            this._recreateGame();
        },
        _updateTop(data) {
            this.top = [];
            
            data.forEach((value, key) => {
                value.key = key + 1;
                this.top.push(value);
                this.lastScore = value;
            });
        },
        _resetGame(type, updateTop = false) {
            if (this.gameObject) {
                this.gameObject.forceEndGame();
                this.gameObject.destroyView();
                this.gameObject = null;
            }

            for (let i = 0; i < this.games.length; i++) {
                if (this.games[i].text === type) {
                    const game = this.games[i].value;
                    
                    this.settings = game.settings();
                    this.rules = game.rules();
                    this.game = game;
                    break;
                }
            }
        },
        async _recreateGame(updateTop = true) {
            if (this.gameObject) {
                this._resetGame(this.type);
            }

            if (updateTop) {
                const response = await api.score.list(this.type, 10);
                this._updateTop(response.data);
            }

            const settings = this.rating ? [] : this.settingsValues;

            this.gameObject = new this.game({onEndGame: this._handleEndGame, settings: settings});
        },
        _handleEndGame() {
            if (
                this.rating &&
                this.gameObject.score() > 0 &&
                (!this.lastScore || this.gameObject.score() > this.lastScore.score || this.lastScore.key < 10)
            ) {
                this.score = this.gameObject.score();
                $('#scoreModal').modal({show: true});
            }
        },
        postScore() {
            let data = {score: this.score, type: this.type, name: this.name};

            api.score.post(data).then(() => {
                $('#scoreModal').modal('hide');
            });
        },
        startGame() {
            this._recreateGame(false);
            EventHelper.fire('start');
        },
        changeSettings(e) {
            this.settingsValues[e[0]] = Number(e[1]);
            this._recreateGame(false);
        },
        changeRating(e) {
            this._recreateGame(false);
        }
    }
});