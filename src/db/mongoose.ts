import Mongoose from 'mongoose';

const connString = 'mongodb://127.0.0.1:27017/task_manager_api';
Mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
