import Express from 'express';
import { authorizer } from './middleware/authorizer';
import { UserRouter } from './routers/user.router';
import { TaskRouter } from './routers/task.router';

require('./db/mongoose');

const app = Express();

app.use(authorizer);

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(UserRouter);
app.use(TaskRouter);

export default app;
