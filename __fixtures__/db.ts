import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User } from '../src/models/user.model';
import { Task } from '../src/models/task.model';

export const userOneId = new Types.ObjectId();
export const userTwoId = new Types.ObjectId();

export const userOneToken = jwt.sign(
  { _id: userOneId },
  process.env.JWT_SECRET || ''
);

export const userTwoToken = jwt.sign(
  { _id: userTwoId },
  process.env.JWT_SECRET || ''
);

export const userOne = {
  _id: userOneId,
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test123!',
  tokens: [{ token: userOneToken }],
};

export const userTwo = {
  _id: userTwoId,
  name: 'User Two',
  email: 'test2@example.com',
  password: 'Test123!',
};

export const saveUsers = async () => {
  await new User(userOne).save();
  await new User(userTwo).save();
};

export const taskOne = {
  _id: new Types.ObjectId(),
  description: 'first task',
  completed: false,
  user: userOneId,
};

export const taskTwo = {
  _id: new Types.ObjectId(),
  description: 'second task',
  completed: false,
  user: userOneId,
};

export const taskThree = {
  _id: new Types.ObjectId(),
  description: 'third task',
  completed: true,
  user: userTwoId,
};

export const saveTasks = async () => {
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};
