import Mongoose from 'mongoose';

const connString = 'mongodb://127.0.0.1:27017/task_manager_api';
Mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

const userSchema = new Mongoose.Schema({
  name: { type: String },
  age: { type: Number }
});

const User = Mongoose.model('User', userSchema);

// const andrew = new User({ name: 'Andrew', age: 29 });
// andrew
//   .save()
//   .then((data) => console.log('created user:', data))
//   .catch(err => console.error('failed to save user', err));

const invalid = new User({ name: 'Andrew', age: 'invalid' });
invalid
  .save()
  .then((data) => console.log('created user:', data))
  .catch(err => console.error('failed to save user', err));