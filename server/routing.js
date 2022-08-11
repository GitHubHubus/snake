'use strict';

const {getList, create} = require('./controller/score');
const {sendEmail} = require('./controller/main');

const addRoutes = (app, ioTop) => {
    app.get('/api/score/:type/:limit', getList);

    app.post('/api/score', (req, res) => {
        create(req, res, ioTop);
    });

    app.post('/api/email', sendEmail);
}

module.exports = addRoutes;