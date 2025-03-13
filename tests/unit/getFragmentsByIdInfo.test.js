/// <summary>
/// This module is a test file for ../../src/routes/api/getFragmentsByIdInfo.js
/// </summary>

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/tmpID/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/tmpID/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get fragment', async () => {
    // Send a buffer to the user
    const testBuffer = 'This is a fragment';
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testBuffer);

    const created = res.body.created;
    const updated = res.body.updated;
    const size = res.body.size;
    const id = res.body.id;
    const ownerId = res.body.ownerId;
    const type = res.body.type;

    res = await request(app).get(`/v1/fragments/${id}/info`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.ownerId).toEqual(ownerId);
    expect(res.body.type).toEqual(type);
    expect(res.body.created).toEqual(created);
    expect(res.body.updated).toEqual(updated);
    expect(res.body.size).toEqual(size);
    expect(res.body.id).toEqual(id);
  });

  test('authorized user gets invalid fragment with bad ID', async () => {
    const res = await request(app)
      .get(`/v1/fragments/badID/info`)
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.statusCode).toBe(404);
  });
});
