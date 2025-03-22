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
      .send(data);

    //Checking for the host is too dynamic, so we just check if it has the important content
    expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.size).toBe(testBuffer.length);
    expect(res.body.fragment.data.type).toEqual('Buffer');
    expect(res.body.fragment.data.data).toEqual(Array.from(data));
  });

  test('authenticated user making a json fragment', async () => {
    const testBuffer = '{"data": "This is a fragment"}';
    const data = Buffer.from(testBuffer);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(testBuffer);

    expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.size).toEqual(testBuffer.length);
    expect(res.body.fragment.data.type).toEqual('Buffer');
    expect(res.body.fragment.data.data).toEqual(Array.from(data));
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
