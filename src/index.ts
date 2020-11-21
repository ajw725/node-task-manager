import Express from 'express';
require('./db/mongoose');
import { User } from './models/user';

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});