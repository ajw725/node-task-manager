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
    const users = db.collection('users');
    // insert one user
    // users.insertOne(
    //   {
    //     name: 'Andrew',
    //     age: 29,
    //   },
    //   (dbError, dbResult) => {
    //     if (dbError) {
    //       return console.error('error inserting document:', dbError);
    //     }
    //     console.log(dbResult.ops);
    //   }
    // );
    // insert two users
    // users.insertMany(
    //   [
    //     { name: 'Jack', age: 30 },
    //     { name: 'Jill', age: 28 },
    //   ],
    //   (dbError, dbResult) => {
    //     if (dbError) {
    //       return console.error('error creating records:', dbError);
    //     }
    //     console.log('created users:', dbResult.ops);
    //   }
    // );
    // insert three tasks
    const tasks = db.collection('tasks');
    tasks.insertMany([
        { description: 'learn nodejs', completed: false },
        { description: 'cook dinner', completed: true },
        { description: 'sleep', completed: false },
    ], (dbError, dbResult) => {
        if (dbError) {
            return console.error('error creating tasks:', dbError);
        }
        console.log('created tasks:', dbResult.ops);
    });
});
