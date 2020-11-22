import Express from 'express';
require('./db/mongoose');
import dotenv from 'dotenv';
import { UserRouter } from './routers/user.router';
import { TaskRouter } from './routers/task.router';

dotenv.config();

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
const port = parseInt(process.env.PORT || '3000');

app.use(UserRouter);
app.use(TaskRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
