import request from 'supertest';
import { send } from '../__mocks__/@sendgrid/mail';
import app from '../src/app';
import { User } from '../src/models/user.model';

const newUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test123!',
};

describe('POST /users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(() => {
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
    jest.clearAllMocks();
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
