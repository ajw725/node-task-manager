import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User } from '../src/models/user.model';

export const userOneId = new Types.ObjectId();

export const userOneToken = jwt.sign(
  { _id: userOneId },
  process.env.JWT_SECRET || ''
);

export const newUser = {
  _id: userOneId,
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test123!',
  tokens: [{ token: userOneToken }],
};

export const saveUser = async () => {
  const user = new User(newUser);
  await user.save();
};
