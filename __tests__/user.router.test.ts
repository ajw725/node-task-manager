import request from 'supertest';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { send } from '../__mocks__/@sendgrid/mail';
import app from '../src/app';
import { User } from '../src/models/user.model';

const userOneId = new Types.ObjectId();
const userOneToken = jwt.sign({ _id: userOneId }, process.env.JWT_SECRET);
const newUser = {
  _id: userOneId,
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test123!',
  tokens: [{ token: userOneToken }],
};

describe('POST /users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    await request(app).post('/users').send(newUser).expect(201);
  });

  it('should send an email', async () => {
    await request(app).post('/users').send(newUser);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should error on duplicate email', async () => {
    const user = new User(newUser);
    await user.save();

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
    beforeEach(async () => {
      const user = new User(newUser);
      await user.save();
    });

    it('should log in with correct creds', async () => {
      const { email, password } = newUser;
      await request(app).post('/login').send({ email, password }).expect(200);
    });

    it('should return 401 with wrong email', async () => {
      await request(app)
        .post('/login')
        .send({
          email: 'wrong@example.com',
          password: newUser.password,
        })
        .expect(401);
    });

    it('should return 401 with wrong password', async () => {
      await request(app)
        .post('/login')
        .send({
          email: newUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('without existing user', () => {
    it('should return 401', async () => {
      const { email, password } = newUser;
      await request(app).post('/login').send({ email, password }).expect(401);
    });
  });
});

describe('GET /users/me', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('with existing user', () => {
    beforeEach(async () => {
      const user = new User(newUser);
      await user.save();
    });

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
    beforeEach(async () => {
      const user = new User(newUser);
      await user.save();
    });

    it('should remove user if authenticated', async () => {
      await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send()
        .expect(200);
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
