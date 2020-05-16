const chalk = require('chalk');
const request = require('superagent');
const server = require('../src/api/src/server');

const API_BASE_URL = 'localhost:5000/api/v1';

beforeAll(async () => {
  console.info(chalk.magenta.bold('Running test suite...'));
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
