import BaseSnakeGame from './BaseSnakeGame';
import EventHelper from '../Helper/EventHelper';
import Purpose from '../Models/Purpose';
import i18next from 'i18next';

export default class SnakeGame2 extends BaseSnakeGame {
    static description () {
        return super.description(SnakeGame2.id());
    }

    static rules() {
        return super.rules(SnakeGame2.id());
    }

    static id() {
        return 2;
    }

    static settings() {
        return super.settings().concat([
            {type: 'number', max:1500, min: 150, step: 10, label: i18next.t('games.settings.purposes_add_speed'), key: 'purposes_add_speed'},
            {type: 'number', max:100, min: 1, step: 1, label: i18next.t('games.settings.permissible_field_filling'), key: 'permissible_field_filling'},
        ]);
    }

    constructor (params) {
        super(params);

        const percentFilling = params.settings.permissible_field_filling || 25;
        this._purposeTypes = [
            {type: 'remove_purposes_by_area', color: 'yellow', action: this._removePurposesByArea},
            {type: 'increase_snake', color: 'red', action: this._increaseSnake},
            {type: 'decrease_snake', color: 'orange', action: this._decreaseSnake},
            {type: 'increase_speed_snake', color: 'blue', action: this._increaseSnakeSpeed},
            {type: 'decrease_speed_snake', color: 'gray', action: this._decreaseSnakeSpeed},
            {type: 'increase_speed_add_purpose', color: 'brown', action: this._increaseAddPurposeSpeed},
            {type: 'decrease_speed_add_purpose', color: 'bluewhite', action: this._decreaseAddPurposeSpeed}
        ];
        this._purposes = [];
        this._purposesAddInterval = null;
        this._purposesAddSpeed = params.settings.purposes_add_speed || 300;
        this._permissibleFieldFilling = ((this._field.getCountTiles() - this._snake.length) * percentFilling) / 100;
    }

    _stopAddPurpose() {
        clearInterval(this._purposesAddInterval);
    }

    _handle(event) {
        this._purposesAddInterval = setInterval(this._addPurpose.bind(this), this._purposesAddSpeed);
    }

    _handleSnakeMoving(event) {
        let point = this._snake.decreaseSnake();

        this._field.unlockTile(point);
        this._field.cleanTile(point);

        if (this._snake.isSnake(event.p) || this._field.isBorder(event.p)) {
            this.handleEndGame();
        } else {
            this._executeAndRemovePurpose(event.p);
        }

        this._snake.increaseSnake(event.p);
        this._field.fillTile(event.p, this._snake.color);
        this._field.lockTile(event.p);
    }

    _slicePurpose(p) {
        let purpose = null;

        for (let i in this._purposes) {
            if (this._purposes[i].p.x == p.x && this._purposes[i].p.y == p.y) {
                purpose = this._purposes[i];
                this._purposes.splice(i, 1);
                
                break;
            }
        }
        
        return purpose;
    }

    _executeAndRemovePurpose(p) {
        let purpose = this._slicePurpose(p);

        if (purpose) {
            purpose.action();
            this._score.set(purpose.amount);
        }
    }

    _addPurpose() {
        let params = this._getRandomPurposeType();
        params.p = this.getRandomPoint();

        let purpose = new Purpose(params);
        purpose._closure = this;

        this._field.fillTile(purpose.p, purpose.color);
        this._field.lockTile(purpose.p);

        this._purposes.push(purpose);

        if (this._purposes.length > this._permissibleFieldFilling) {
            this.handleEndGame();
        } else {
            EventHelper.fire('add_purpose', {purpose: purpose});
        }
    }

    _getRandomPurposeType() {
        return this._purposeTypes[parseInt(Math.random() * this._purposeTypes.length)];
    }

    _removePurposesByArea() {
        let square = [-2, -1, 0, 1, 2];
        for (let i in square) {
            for (let j in square) {
                let p = {x: this.p.x + square[i], y: this.p.y + square[j]};

                if (!this._closure._snake.isSnake(p) && !this._closure._field.isBorder(p)) {
                    let purpose = this._closure._slicePurpose(p);
                    
                    if (purpose) {
                        this._closure._field.unlockTile(purpose.p);
                        this._closure._field.cleanTile(purpose.p);
                    }
                }
            }
        }
    }

    _increaseSnake() {
        this._closure._snake.increaseSnake(this.p);
        this._closure._field.fillTile(this.p, this._closure._snake.color);
        this._closure._field.lockTile(this.p);
    }

    _decreaseSnake() {
        if (this._closure._snake.length > 1) {
            let point = this._closure._snake.decreaseSnake();
            this._closure._field.unlockTile(point);
            this._closure._field.cleanTile(point); 
        }
    }

    _decreaseSnakeSpeed() {
        this._closure._snake.changeInterval(10);
    }

    _increaseSnakeSpeed() {
        this._closure._snake.changeInterval(-10);
    }

    _decreaseAddPurposeSpeed() {
        this._closure._purposesAddSpeed += 10;
        this._closure._stopAddPurpose();
        this._closure._purposesAddInterval = setInterval(this._closure._addPurpose.bind(this._closure), this._closure._purposesAddSpeed);
    }

    _increaseAddPurposeSpeed() {
        this._closure._purposesAddSpeed -= 10;
        this._closure._stopAddPurpose();
        this._closure._purposesAddInterval = setInterval(this._closure._addPurpose.bind(this._closure), this._closure._purposesAddSpeed);
    }
    
    handleEndGame(isForce = false) {
        this._stopAddPurpose();
        super.handleEndGame(isForce);
    }
}
