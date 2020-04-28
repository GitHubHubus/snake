'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser());

const init = () => {
    mongoClient.connect('mongodb://mongodb_image:27017', {
      auth: {
        user:'root',
        password:'rootpassword'
      },
      useNewUrlParser:true
    }, (err, client) => {
        if(err) console.log(err);
        const db = client.db('snake');
        
        if (db) {
            app.locals.score = db.collection("score");
        }

        app.listen(8080, '0.0.0.0');
        console.log(`Running server`);
    });
};

init();

app.get('/top/:type/:limit', (req, res) => {
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
      name: req.body.name,
      type: req.body.type,
      score: req.body.score
  };

  req.app.locals.score.insertOne(data, null, () => {
      res.send('OK');
  });
});