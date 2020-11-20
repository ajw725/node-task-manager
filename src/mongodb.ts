import { MongoClient, ObjectID } from 'mongodb';

const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

MongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (connError, client) => {
    if (connError) {
      return console.error('error connecting to database:', connError);
    }

    const db = client.db(dbName);
    const users = db.collection('users');
    const userId = '5fac9cca64e5a57a53fd1f61';
    // users
    //   .updateOne(
    //     { _id: new ObjectID(userId) },
    //     {
    //       // $set: {
    //       //   name: 'NotAndrew',
    //       // },
    //       $inc: {
    //         age: 1
    //       }
    //     }
    //   )
    //   .then((result) => {
    //     const updatedCt = result.modifiedCount;
    //     console.log(`updated ${updatedCt} users`);
    //   })
    //   .catch((err) => {
    //     console.error('error updating user:', err);
    //   });

    // users.deleteOne(
    //   { _id: new ObjectID(userId) }
    // ).then(res => {
    //   console.log(`deleted ${res.deletedCount} records`);
    // }).catch(err => {
    //   console.error('error deleting user', err);
    // })

    const tasks = db.collection('tasks');
    tasks.updateMany(
      {},
      { 
        $set: {
          completed: true
        }
      }
    )
  }
);
