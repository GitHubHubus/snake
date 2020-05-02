'use strict';

const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const NumberInt = require('mongodb').Int32;
const cors = require('cors');
const fs = require('fs');
let settings = JSON.parse(fs.readFileSync('../settings.json', 'utf-8'))
const io = require('socket.io')(server, { origins: '*:*'});
const top = io.of('/top');
app.use(cors());
app.use(bodyParser());

const init = () => {
    mongoClient.connect(settings.db.connection, {
      auth: {
        user: settings.db.user,
        password: settings.db.password
      },
      useNewUrlParser:true
    }, (err, client) => {
        if(err) console.log(err);
        const db = client.db('snake');
        
        if (db) {
            app.locals.score = db.collection("score");
        }

        server.listen(8080, '0.0.0.0');
        console.log(`Running server`);
    });
};

init();

app.get('/score/:type/:limit', (req, res) => {
    req.app.locals.score.find({type: req.params.type})
         .sort({ score: -1 })
         .limit(Number(req.params.limit))
         .toArray(function(error, data) {
            if (error) throw error;

            res.send(data);
        });
});

app.post('/score', (req, res) => {
    const data = {
        name: req.body.name == '' ? 'Newbie' : req.body.name,
        type: req.body.type,
        score: NumberInt(req.body.score)
    };

    req.app.locals.score.insertOne(data, null, () => {
        top.emit('refresh', { type: req.body.type, score: [] });
        res.send('OK');
    });
});