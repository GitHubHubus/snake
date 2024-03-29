import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n';
import './css/snake.scss';
import $ from 'jquery';
import Vue from 'vue';
import api from './js/Api/index';
import games from './js/SnakeGame/index';
import EventHelper from './js/SnakeGame/Helper/EventHelper';
import socketConnect from './js/Api/WebSocket';
import translate from './js/Helper/translator';
import TableScore from './view/components/TableScore';
import Input from './view/components/Input';
import Select from './view/components/Select';
import FeedbackModal from './view/components/Feedback/Modal';
import FeedbackButton from './view/components/Feedback/Button';
import ScoreModal from './view/components/ScoreModal';
import locales from './locales/en/translation';
import PvpSnakeGame from "./js/SnakeGame/Games/PvpSnakeGame";

Vue.component('table-score', TableScore);
Vue.component('settings-input', Input);
Vue.component('settings-select', Select);
Vue.component('feedback-modal', FeedbackModal);
Vue.component('feedback-button', FeedbackButton);
Vue.component('score-modal', ScoreModal);

const ARROW_KEY_CODES = [37, 38, 39, 40];

const v = new Vue({
    el: '#app',
    created() {
        socketConnect('top').on('refresh', (data) => {
            Number(data.type) === this.game.id() && this._updateTop(data.score);
        });

        window.addEventListener("keydown", function(e) {
            if(ARROW_KEY_CODES.indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

        this._recreateGame(1);
    },
    data: {
        lockGame: false,
        trans: translate(locales),
        top: [],
        lastScore: null,
        score: 0,
        countPvpPlayers: 0,
        rating: true,
        games: Object.entries(games).map(game => {return {value: game[0], text: game[1].description()};}),
        game: games[1],
        gameObject: null,
        settingsValues: {}
    },
    methods: {
        changeGame(e) {
            this._recreateGame(Number(e.target.value));
        },
        startGame() {
            if (this.gameObject && this.game.id() === PvpSnakeGame.id()) {
                this._recreateGame(this.game.id(), false);
                this.lockGame = true;
            }

            this.gameObject.ready(() => {
                if (this.game.id() !== PvpSnakeGame.id()) {
                    this.lockGame = true;
                    this._recreateGame(this.game.id(), false);
                }

                EventHelper.fire('start');
            });
        },
        changeSettings(e) {
            this.settingsValues[e[0]] = Number(e[1]);
            this._recreateGame(this.game.id(), false);
        },
        changeRating(e) {
            this._recreateGame(this.game.id(), false);
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
        async _recreateGame(type, updateTop = true) {
            if (this.gameObject) {
                this._resetGame(type);
            }

            if (updateTop) {
                const response = await api.score.list(type, 10);
                if (response) {
                    this._updateTop(response.data);
                }
            }

            const settings = this.rating && this.game.id() !== PvpSnakeGame.id() ? [] : this.settingsValues;

            this.gameObject = new this.game({
                onEndGame: this._handleEndGame,
                settings: settings,
                disableCreateSnake: Number(type) === PvpSnakeGame.id()
            });
        },
        _handleEndGame() {
            this.lockGame = false;

            if (
                this.rating &&
                this.gameObject &&
                this.game.id() !== PvpSnakeGame.id() &&
                this.gameObject.boardInfo() > 0 &&
                (!this.lastScore || this.gameObject.boardInfo() > this.lastScore.value || this.lastScore.key < 10)
            ) {
                this.score = this.gameObject.boardInfo();
                $('#scoreModal').modal({show: true});
            }
        }
    }
});