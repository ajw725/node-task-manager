import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/user.model';
import { Task } from '../src/models/task.model';
import {
  userOneId,
  userOneToken,
  userTwoToken,
  taskOne,
  saveUsers,
  saveTasks,
} from '../__fixtures__/db';

describe('POST /tasks', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await saveUsers();
    await saveTasks();
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

describe('GET /tasks', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await saveUsers();
    await saveTasks();
  });

  it('should return tasks for user when logged in', async () => {
    const resp = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send()
      .expect(200);
    expect(resp.body.length).toEqual(2);
  });
});

describe('DELETE /tasks/:id', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await saveUsers();
    await saveTasks();
  });

  it('should allow deletion for task owner', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOneToken}`)
      .send()
      .expect(200);
  });

  it('should prevent deletion by another user', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userTwoToken}`)
      .send()
      .expect(401);
  });
});
