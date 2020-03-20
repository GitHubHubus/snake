'use strict';

const express = require('express');
const mongoClient = require('mongodb').MongoClient;

const app = express();

const init = (callback) => {
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
}

init();

app.get('/top/:type/:limit', (req, res) => {
    const score = req.app.locals.score;
    const type = req.params.type;
    
    const data = score.find().toArray(function(error, documents) {
    if (error) throw error;

    res.send(documents);
});//.sort({[type]: -1}).limit(Number(req.params.limit));
});

app.post('/score', (req, res) => {
  const data = {
      name: req.body.name,
      type: req.body.type,
      score: req.body.score
  }
  
  req.app.locals.score.insert({data});
});