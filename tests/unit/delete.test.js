/// <summary>
/// This module is a test file for ../../src/routes/api/delete/delete.js
/// </summary>

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated delete non-existent fragment', async () => {
    const res = await request(app)
      .delete('/v1/fragments/impossible')
      .auth('user1@email.com', 'password1');

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.statusCode).toBe(404);
  });

  test('authenticated user gets deletes their fragment', async () => {
    // Send a buffer to the user
    const testBuffer = 'This is a fragment';
    const data = Buffer.from(testBuffer);
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testBuffer);

    const id = res.body.fragment.id;

    //Ensure its defined
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

    // Delete the fragment
    res = await request(app).delete(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');

    // Ensure its gone
    res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.statusCode).toBe(404);
  });

  test('authenticated user deletes multiple fragments', async () => {
    // Send a buffer to the user
    const testBuffers = ['These are fragments A', 'B', 'C'];
    const data = [
      Buffer.from(testBuffers[0]),
      Buffer.from(testBuffers[1]),
      Buffer.from(testBuffers[2]),
    ];
    let res;

    // Create the fragments
    const testFragments = [];
    for (let i = 0; i < 3; ++i) {
      res = await request(app)
        .post('/v1/fragments')
        .auth('user2@email.com', 'password2')
        .set('Content-Type', 'text/plain')
        .send(testBuffers[i]);

      const created = res.body.fragment.created;
      const updated = res.body.fragment.updated;
      const size = res.body.fragment.size;
      const id = res.body.fragment.id;
      const ownerId = res.body.fragment.ownerId;
      const type = res.body.fragment.type;

      testFragments[i] = {
        created,
        updated,
        size,
        id,
        ownerId,
        type,
      };

      //Make sure they're all valid
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('text/plain');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toBe(testBuffers[i].length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data[i]));
    }

    // Delete and Confirm they're deleted
    for (let i = 0; i < 3; ++i) {
      res = await request(app)
        .delete(`/v1/fragments/${testFragments[i].id}`)
        .auth('user2@email.com', 'password2');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');

      res = await request(app)
        .get(`/v1/fragments/${testFragments[i].id}`)
        .auth('user1@email.com', 'password1');

      expect(res.status).toBe(404);
      expect(res.body.status).toEqual('error');
      expect(res.statusCode).toBe(404);

      expect(res.status).toBe(404);
      expect(res.body.status).toEqual('error');
      expect(res.statusCode).toBe(404);
    }
  });
});
