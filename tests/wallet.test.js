const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');
const Expense = require('../src/models/Expense');

describe('Wallet API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Signup to get a token
    const signupRes = await request(app)
      .post('/signup')
      .send({
        username: 'Wallet Tester',
        email: 'wallet@test.com',
        password: 'password123'
      });
    token = signupRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'wallet@test.com' });
    await Expense.deleteMany({ userId: userId });
    await mongoose.connection.close();
  });

  it('should update user budget', async () => {
    const res = await request(app)
      .put('/update-budget')
      .set('Authorization', `Bearer ${token}`)
      .send({ budget: 2500 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.budget).toEqual(2500);
  });

  it('should add an expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'groceries', amount: 50 });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.expense).toHaveProperty('category', 'groceries');
  });

  it('should get recent transactions', async () => {
    const res = await request(app)
      .get('/api/recent-transactions')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
