"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';
mongodb_1.MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (connError, client) => {
    if (connError) {
        return console.error('error connecting to database:', connError);
    }
    const db = client.db(dbName);
    db.collection('users').insertOne({
        name: 'Andrew',
        age: 29,
    }, (dbError, dbResult) => {
        if (dbError) {
            return console.error('error inserting document:', dbError);
        }
        console.log(dbResult.ops);
    });
});
