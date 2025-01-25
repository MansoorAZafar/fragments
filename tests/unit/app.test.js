/// <summary>
/// This module is a test file for ../../src/app.js
/// </summary>

const request = require('supertest');
const app = require('../../src/app');

describe('Error Handling', () => {
  test('missing resource middleware', async () => {
    const res = await request(app).get('/non_existent_resource');
    expect(res.statusCode).toBe(404);

    //Check the body
    expect(res.body.status).toBe('error');
    expect(typeof res.body.error === 'object').toBe(true);
    expect(res.body.error.message).toBe('resource not found');
    expect(res.body.error.code).toBe(404);
  });
});
