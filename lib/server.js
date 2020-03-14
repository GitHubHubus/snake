'use strict';

const express = require('express');

const app = express();

app.get('/top', (req, res) => {
  res.send('Hello World');
});

app.post('/score', (req, res) => {
  const data = {
      name: req.body.name,
      type: req.body.type,
      score: req.body.score
  }  
  res.send('Hello World');
});

app.listen(8080, '0.0.0.0');
console.log(`Running server`);