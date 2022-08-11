'use strict';

const mongoClient = require('mongodb').MongoClient;
const settings = require('../../settings.json');

const connection = async () => {
    const client = await mongoClient.connect(settings.db.connection, {
      auth: {
        user: settings.db.user,
        password: settings.db.password
      },
      useNewUrlParser:true
    }).catch(err =>  console.log(err));

    if (!client) {
        return;
    }

    return client.db('snake');
};

module.exports = connection;
