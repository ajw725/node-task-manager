import { Router } from 'express';
import { User } from '../models/user.model';

export const UserRouter = Router();

UserRouter.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

UserRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    if (user) {
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token });
    } else {
      res.status(401).send({ error: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error('login error:', err);
    res.status(500).send({ error: err });
  }
});

UserRouter.get('/users', async (_req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

UserRouter.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      res
        .status(404)
        .send({ error: `User with id ${req.params.id} not found` });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

UserRouter.patch('/users/:id', async (req, res) => {
  const givenFields = Object.keys(req.body);
  const allowedFields = ['name', 'email', 'password', 'age'];
  if (givenFields.length === 0) {
    res
      .status(400)
      .send({ error: 'You must provide at least one field to update.' });
  }

  const isValid = givenFields.every((f) => allowedFields.includes(f));
  if (!isValid) {
    res.status(400).send({ error: 'Invalid field provided for update' });
  }

  try {
    // TODO: figure out how to make this typescript-friendly
    const user: any = User.findById(req.params.id);
    if (user) {
      givenFields.forEach((field) => {
        user[field] = req.body[field];
      });
      await user.save();

      res.status(200).send(user);
    } else {
      res
        .status(404)
        .send({ error: `User with id ${req.params.id} not found` });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

UserRouter.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).send({ message: 'User deleted.' });
    } else {
      res
        .status(404)
        .send({ error: `User with id ${req.params.id} not found.` });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});
