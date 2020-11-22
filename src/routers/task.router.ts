import { Router } from 'express';
import { Task } from '../models/task.model';

export const TaskRouter = Router();

TaskRouter.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

TaskRouter.get('/tasks', async (_req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

TaskRouter.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.status(200).send(task);
    } else {
      res
        .status(404)
        .send({ error: `Task with id ${req.params.id} not found.` });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

TaskRouter.patch('/tasks/:id', async (req, res) => {
  const givenFields = Object.keys(req.body);
  if (givenFields.length === 0) {
    res
      .status(400)
      .send({ error: 'You must provide at least one field to update.' });
  }

  const allowedFields = ['description', 'completed'];
  const isValid = givenFields.every((f) => allowedFields.includes(f));
  if (!isValid) {
    res.status(400).send({ error: 'Invalid field provided for update' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (task) {
      res.status(200).send(task);
    } else {
      res
        .status(404)
        .send({ error: `Task with id ${req.params.id} not found` });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

TaskRouter.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.status(200).send({ message: 'Task deleted.' });
    } else {
      res
        .status(404)
        .send({ error: `Task with id ${req.params.id} not found.` });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
});
