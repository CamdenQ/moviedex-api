require('dotenv').config();
const { expect } = require('chai'),
  supertest = require('supertest');

const app = require('../src/app');

describe('Get /movie', () => {
  const apiToken = process.env.API_TOKEN;

  it('should require authorization', () => {
    return supertest(app).get('/movie').expect(401);
  });

  it('should respond with JSON array', function () {
    return supertest(app)
      .get('/movie')
      .set('Authorization', 'Bearer ' + apiToken)
      .expect(200);
  });
});
