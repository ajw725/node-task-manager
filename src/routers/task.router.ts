import { Router } from 'express';
import { Task } from '../models/task.model';

export const TaskRouter = Router();

TaskRouter.post('/tasks', async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

/*
 * query params:
 *  completed: boolean - task status filter
 *  limit: number - query limit
 *  skip: number - query offset
 *  sortBy: string - field name on which to sort results
 *  sortDir: 'asc' | 'desc' - sort direction
 */
TaskRouter.get('/tasks', async (req, res) => {
  try {
    const match: any = {};
    if (req.query.completed !== undefined) {
      match.completed = req.query.completed;
    }

    const options: any = {};
    if (req.query.limit) {
      options.limit = parseInt(req.query.limit as string);
    }
    if (req.query.skip) {
      options.skip = parseInt(req.query.skip as string);
    }
    if (req.query.sortBy) {
      const sortDir = req.query.sortDir && req.query.sortDir === 'desc' ? -1 : 1;
      options.sort = { [req.query.sortBy as string]: sortDir };
    }

    const user = req.user;
    await user
      .populate({
        path: 'tasks',
        match,
        options,
      })
      .execPopulate();
    res.status(200).send(user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

TaskRouter.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
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
    const task: any = await Task.findOne({
      _id: req.params.id,
      user: req.params._id,
    });
    if (task) {
      givenFields.forEach((field) => {
        task[field] = req.body[field];
      });
      await task.save();

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
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

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
