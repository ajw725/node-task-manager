import Express from 'express';
require('./db/mongoose');
import { User } from './models/user';
import { Task } from './models/task';

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
const port = parseInt(process.env.PORT || '3000');

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
});

app.get('/users', (_req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ error: err }));
});

app.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ error: 'User not found' });
      }
    })
    .catch((err) => res.status(500).send({ error: err }));
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
