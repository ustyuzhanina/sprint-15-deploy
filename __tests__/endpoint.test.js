/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
const supertest = require('supertest');
const app = require('../app.js');

const request = supertest(app);

describe('Endpoints answer to requests', () => {
  it('Returns data and sends status 200 as response to "/users" request', () => {
    return request.get('/users').then((res) => {
      expect(res.status).toBe(200);
      // expect(res.text).toContain();
    });
  });
});
