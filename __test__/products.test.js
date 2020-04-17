const request = require('superagent');
const server = require('../src/back-end/server');

const API_BASE_URL = 'localhost:5000/api/v1';

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe('My Test Suite', () => {
  it('My Test Case', async () => {
    const response = await request.get(`${API_BASE_URL}/products`);
    expect(response.body).toEqual([]);
  });
});
