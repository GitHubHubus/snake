'use strict';

const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

const app = express();

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    app.locals.score = client.db("snake").collection("score");
    app.listen(8080, '0.0.0.0');
    console.log(`Running server`);
});

app.get('/top/:type/:limit', (req, res) => {
    const score = req.app.locals.score;
    const type = req.params.type;
    
    const data = score.find().sort({[type]: -1}).limit(req.params.limit);
    
    res.send(data);
});

app.post('/score', (req, res) => {
  const data = {
      name: req.body.name,
      type: req.body.type,
      score: req.body.score
  }
  
  req.app.locals.score.insert({data});
});