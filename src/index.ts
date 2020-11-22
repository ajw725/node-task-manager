import Express from 'express';
require('./db/mongoose');
import dotenv from 'dotenv';
import { authorizer } from './middleware/authorizer';
import { UserRouter } from './routers/user.router';
import { TaskRouter } from './routers/task.router';

dotenv.config();

const app = Express();
const port = parseInt(process.env.PORT || '3000');

app.use(authorizer);

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(UserRouter);
app.use(TaskRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
