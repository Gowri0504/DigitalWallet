const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to a test database if needed, but here we use the one from app
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'test@test.com' });
    await mongoose.connection.close();
  });

  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        username: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});
