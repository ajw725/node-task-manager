import _ from 'lodash';
import { Schema, Document, model, Model } from 'mongoose';
import validator from 'validator';
import { hash, genSalt, compare } from 'bcrypt';
import { sign as signToken } from 'jsonwebtoken';

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  salt: {
    type: String,
    select: false,
  },
  age: {
    type: Number,
    default: 0,
    validate: [(val: number) => val >= 0, 'Age cannot be negative'],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

export interface UserTokenPayload {
  _id: string;
}

export interface PublicProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
}

UserSchema.methods.generateAuthToken = async function (save = true) {
  const user = this;
  const payload: UserTokenPayload = { _id: user._id.toString() };
  const secret = process.env.JWT_SECRET || '';
  const token = signToken(payload, secret);

  user.tokens = [...user.tokens, { token }];
  if (save) {
    await user.save();
  }

  return token;
};

UserSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email: email });
  if (!user) return null;

  const passwordMatch = await compare(password, user.password);

  return passwordMatch ? user : null;
};

UserSchema.methods.toJSON = function (): PublicProfile {
  return _.pick(this.toObject(), '_id', 'name', 'email', 'age');
};

interface UserToken {
  token: string;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  salt: string;
  age?: number;
  tokens: UserToken[];

  generateAuthToken(save?: boolean): Promise<String>;
}

export type UserField = 'name' | 'email' | 'password' | 'age';

interface IUserModel extends Model<IUserDocument> {
  findByCredentials(email: string, password: string): Promise<IUserDocument>;
}

// CANNOT use an arrow function, because we need to bind "this"
UserSchema.pre('save', async function (next) {
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

export const User = model<IUserDocument, IUserModel>('User', UserSchema);
