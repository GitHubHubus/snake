import EventHelper from './js/SnakeGame/Helper/EventHelper';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/snake.scss';
import Vue from 'vue';
import api from './js/Api/index';
import TableScore from './view/components/TableScore';
import Input from './view/components/Input';
import socket from './js/Api/WebSocket';
import './i18n';
import locales from './locales/en/translation';
import translate from './js/Helper/translator';
import games from './js/SnakeGame/index';

Vue.component('table-score', TableScore);
Vue.component('settings-input', Input);

const v = new Vue({
    el: '#app',
    created() {
        socket.on('refresh', (data) => {
            Number(data.type) === this.type && this._updateTop(data.score);
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
        email: '',
        message: '',
        lockGame: false,
        trans: translate(locales),
        top: [],
        lastScore: null,
        score: 0,
        type: games[1].id(),
        name: '',
        rating: true,
        games: Object.entries(games).map(game => {return {value: game[0], text: game[1].description()};}),
        game: games[1],
        gameObject: null,
        settingsValues: {}
    },
    methods: {
        changeGame(e) {
            this.type = Number(e.target.value);
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

            this.game = games[type];
        },
        async _recreateGame(updateTop = true) {
            if (this.gameObject) {
                this._resetGame(this.type);
            }

            if (updateTop) {
                const response = await api.score.list(this.type, 10);
                if (response) {
                    this._updateTop(response.data);
                }
            }

            const settings = this.rating ? [] : this.settingsValues;

            this.gameObject = new this.game({onEndGame: this._handleEndGame, settings: settings});
        },
        _handleEndGame() {
            this.lockGame = false;
            
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
        openEmailModal() {
            $('#emailModal').modal({show: true});
        },
        sendEmail() {
            let data = {email: this.email, message: this.message};

            api.email.post(data).then(() => {
                $('#emailModal').modal('hide');
            });
        },
        startGame() {
            this.gameObject.ready(() => {
                this._recreateGame(false);
                this.lockGame = true;
                EventHelper.fire('start');
            });
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