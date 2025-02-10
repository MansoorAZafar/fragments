/// <summary>
/// This module is a test file for ../../src/routes/api/post.js
/// </summary>

const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair create a fragment
  test('authenticated user creating a fragment', async () => {
    const testBuffer = 'This is a fragment';
    const data = Buffer.from(testBuffer);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testBuffer);

    //Checking for the host is too dynamic, so we just check if it has the important content
    expect(res.headers['location']).toContain(`v1/fragment/${res.body.id}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.id).toBeDefined();
    expect(res.body.ownerId).toBeDefined();
    expect(res.body.type).toBe('text/plain');
    expect(res.body.created).toBeDefined();
    expect(res.body.updated).toBeDefined();
    expect(res.body.size).toBe(testBuffer.length);
    expect(res.body.data.type).toEqual('Buffer');
    expect(res.body.data.data).toEqual(Array.from(data));
  });

  test('authenticated user attempting unsupported fragment type', async () => {
    const testBuffer = 'This is a fragment';
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/msword')
      .send(testBuffer)
      .expect(415);
  });
});
