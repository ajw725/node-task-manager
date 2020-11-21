import Mongoose from 'mongoose';
import validator from 'validator';

const connString = 'mongodb://127.0.0.1:27017/task_manager_api';
Mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: [
      (val: string) => validator.isEmail(val),
      'Invalid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate: [
      (val: string) => !val.toLowerCase().includes('password'),
      'Password cannot contain the string "password"',
    ],
  },
  age: {
    type: Number,
    default: 0,
    validate: [(val: number) => val >= 0, 'Age cannot be negative'],
  },
});

const User = Mongoose.model('User', userSchema);

const user = new User({
  name: ' Bodie ',
  email: 'BODIE@example.com',
  password: ' password123',
  age: 2,
});
// user
//   .save()
//   .then((data) => console.log('created user:', data))
//   .catch((err) => console.error('failed to save user:', err.errors));

// const invalid = new User({ name: 'Andrew', age: 'invalid' });
// invalid
//   .save()
//   .then((data) => console.log('created user:', data))
//   .catch(err => console.error('failed to save user', err));

const taskSchema = new Mongoose.Schema({
  description: {
    type: String,
    required: [true, 'You must provide a task description'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
const Task = Mongoose.model('Task', taskSchema);
const firstTask = new Task({ description: '', completed: true });
firstTask
  .save()
  .then((t) => console.log('created task:', t))
  .catch((e) => console.error('failed to create task:', e));
