'use strict';

const score = require('../service/db/score.js');
const NumberInt = require('mongodb').Int32;

const getList = (req, res) => {
    score.top(req.params).then((data) => {
        res.send(data);
    });
}

const create = (req, res, ioTop) => {
    const data = {
        name: req.body.name === '' ? 'Newbie' : req.body.name.substring(0, 20),
        type: req.body.type,
        score: NumberInt(req.body.score)
    };

    score.post(data).then(() => {
        score.top({type: data.type, limit: 10}).then((result) => {
            ioTop.emit('refresh', { type: data.type, score: result });
            res.send('OK');
        });
    });
}

exports.getList = getList;
exports.create = create;