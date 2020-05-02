'use strict';

const connection = require('./db.js');

module.exports = {
    top: async (params) => {
        const db = await connection();
        
        return db.collection('score').find({type: params.type})
                .sort({ score: -1 })
                .limit(Number(params.limit))
                .toArray()
                .catch((e) => console.log(e));
    },
    post: async (data) => {
        const db = await connection();
        
        return db.collection('score').insertOne(data);
    }
}
