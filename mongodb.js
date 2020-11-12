const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.error('error connecting to database:', err);
  }

  console.log('Connected!');
});
