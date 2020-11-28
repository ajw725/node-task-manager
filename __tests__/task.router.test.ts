import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/user.model';
import { Task } from '../src/models/task.model';
import { userOneId, userOneToken, saveUser } from '../__fixtures__/db';

describe('POST /tasks', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await User.deleteMany({});
    await saveUser();
  });

  it('should create task when logged in', async () => {
    const resp = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({
        description: 'test task',
        completed: false,
      })
      .expect(201);

    const task = await Task.findById(resp.body._id);
    expect(task!.user).toEqual(userOneId);
  });
});
