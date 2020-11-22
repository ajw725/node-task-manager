import Mongoose from 'mongoose';
import validator from 'validator';
import { hash, genSalt } from 'bcrypt';

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
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
    select: false,
  },
  salt: {
    type: String,
    select: false,
  },
  age: {
    type: Number,
    default: 0,
    validate: [(val: number) => val >= 0, 'Age cannot be negative'],
  },
});

// CANNOT use an arrow function, because we need to bind "this"
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const rawPassword = user.get('password');
    let salt = user.get('salt');
    if (!salt) {
      salt = await genSalt();
      user.set('salt', salt);
    }
    const hashedPassword = await hash(rawPassword, salt);
    user.set('password', hashedPassword);
  }

  next();
});

export const User = Mongoose.model('User', userSchema);
