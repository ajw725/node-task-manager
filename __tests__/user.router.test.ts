import request from 'supertest';
import { send } from '../__mocks__/@sendgrid/mail';
import app from '../src/app';
import { User } from '../src/models/user.model';
import {
  userOne,
  userOneId,
  userOneToken,
  saveUsers,
} from '../__fixtures__/db';

describe('POST /users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const resp = await request(app).post('/users').send(userOne).expect(201);
    const user = await User.findById(resp.body.user._id);
    expect(user).not.toBeNull();
  });

  it('should send an email', async () => {
    await request(app).post('/users').send(userOne);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should error on duplicate email', async () => {
    await saveUsers();

    const user2 = {
      name: 'User Two',
      email: 'test@example.com',
      password: 'Test321!',
    };
    await request(app).post('/users').send(user2).expect(400);
  });
});

describe('POST /login', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('for existing user', () => {
    beforeEach(saveUsers);

    it('should log in with correct creds', async () => {
      const { email, password } = userOne;
      await request(app).post('/login').send({ email, password }).expect(200);
    });

    it('should save and return new token', async () => {
      const { email, password } = userOne;
      const resp = await request(app).post('/login').send({ email, password });
      const returnedToken = resp.body.token;
      const user = await User.findById(userOneId);
      expect(returnedToken).toEqual(user!.tokens[1].token);
    });

    it('should return 401 with wrong email', async () => {
      await request(app)
        .post('/login')
        .send({
          email: 'wrong@example.com',
          password: userOne.password,
        })
        .expect(401);
    });

    it('should return 401 with wrong password', async () => {
      await request(app)
        .post('/login')
        .send({
          email: userOne.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('without existing user', () => {
    it('should return 401', async () => {
      const { email, password } = userOne;
      await request(app).post('/login').send({ email, password }).expect(401);
    });
  });
});

describe('GET /users/me', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('with existing user', () => {
    beforeEach(saveUsers);

    it('should return profile if authenticated', async () => {
      await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send()
        .expect(200);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app).get('/users/me').send().expect(401);
    });
  });

  describe('without existing user', () => {
    it('should return 401', async () => {
      await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send()
        .expect(401);
    });
  });
});

describe('DELETE /users/me', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('with existing user', () => {
    beforeEach(saveUsers);

    it('should remove user if authenticated', async () => {
      await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send()
        .expect(200);
      const user = await User.findById(userOneId);
      expect(user).toBeNull();
    });

    it('should return 401 if not authenticated', async () => {
      await request(app).delete('/users/me').send().expect(401);
    });
  });

  describe('without existing user', () => {
    it('should return 401', async () => {
      await request(app).delete('/users/me').send().expect(401);
    });
  });
});

describe('POST /users/me/avatar', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('with existing user', () => {
    beforeEach(saveUsers);

    it('should save avatar if authenticated', async () => {
      await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOneToken}`)
        .attach('avatar', '__fixtures__/profile-pic.jpg')
        .expect(200);

      const user = await User.findById(userOneId);
      expect(user!.avatar).toEqual(expect.any(Buffer));
    });
  });
});

describe('PATCH /users/me', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('with existing user', () => {
    beforeEach(saveUsers);

    it('should update name if authenticated', async () => {
      await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ name: 'new name' })
        .expect(200);

      const user = await User.findById(userOneId);
      expect(user!.name).toEqual('new name');
    });

    it('should fail if not authenticated', async () => {
      await request(app)
        .patch('/users/me')
        .send({ name: 'new name' })
        .expect(401);
    });

    it('should fail for invalid field', async () => {
      await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ badfield: 'new name' })
        .expect(400);
    });

    it('should fail if no fields given', async () => {
      await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send()
        .expect(400);
    });
  });
});
