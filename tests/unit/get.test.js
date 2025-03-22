/// <summary>
/// This module is a test file for ../../src/routes/api/get.js
/// </summary>

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get an empty fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated user gets 1 sent fragments expanded', async () => {
    // Send a buffer to the user
    const testBuffer = 'This is a fragment';
    const data = Buffer.from(testBuffer);
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testBuffer);

    const created = res.body.fragment.created;
    const updated = res.body.fragment.updated;
    const size = res.body.fragment.size;
    const id = res.body.fragment.id;
    const ownerId = res.body.fragment.ownerId;
    const type = res.body.fragment.type;

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

    res = await request(app).get(`/v1/fragments?expand=1`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].ownerId).toEqual(ownerId);
    expect(res.body.fragments[0].type).toEqual(type);
    expect(res.body.fragments[0].created).toEqual(created);
    expect(res.body.fragments[0].updated).toEqual(updated);
    expect(res.body.fragments[0].size).toEqual(size);
    expect(res.body.fragments[0].id).toEqual(id);
  });

  test('authenticated user gets 1 sent fragments NOT no parameters', async () => {
    // Send a buffer to the user
    const testBuffer = 'This is a fragment';
    const data = Buffer.from(testBuffer);
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(testBuffer);

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

    res = await request(app).get(`/v1/fragments`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].ownerId).toEqual(undefined);
    expect(res.body.fragments[0].type).toEqual(undefined);
    expect(res.body.fragments[0].created).toEqual(undefined);
    expect(res.body.fragments[0].updated).toEqual(undefined);
    expect(res.body.fragments[0].size).toEqual(undefined);
    expect(res.body.fragments[0].id).toEqual(undefined);

    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated user gets 1 sent fragments Random Parameters', async () => {
    const res = await request(app)
      .get(`/v1/fragments?sdsafdsf=dsfsdfds`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].ownerId).toEqual(undefined);
    expect(res.body.fragments[0].type).toEqual(undefined);
    expect(res.body.fragments[0].created).toEqual(undefined);
    expect(res.body.fragments[0].updated).toEqual(undefined);
    expect(res.body.fragments[0].size).toEqual(undefined);
    expect(res.body.fragments[0].id).toEqual(undefined);

    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated user gets 1 sent fragments Wrong Expand Assignment', async () => {
    const res = await request(app)
      .get(`/v1/fragments?expand=5`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].ownerId).toEqual(undefined);
    expect(res.body.fragments[0].type).toEqual(undefined);
    expect(res.body.fragments[0].created).toEqual(undefined);
    expect(res.body.fragments[0].updated).toEqual(undefined);
    expect(res.body.fragments[0].size).toEqual(undefined);
    expect(res.body.fragments[0].id).toEqual(undefined);

    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated user gets multiple sent fragments expanded', async () => {
    // Send a buffer to the user
    const testBuffers = ['These are fragments A', 'B', 'C'];
    const data = [
      Buffer.from(testBuffers[0]),
      Buffer.from(testBuffers[1]),
      Buffer.from(testBuffers[2]),
    ];
    let res;

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

    res = await request(app).get(`/v1/fragments?expand=1`).auth('user2@email.com', 'password2');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(3);

    const receivedFragments = res.body.fragments;
    expect(receivedFragments).toEqual(res.body.fragments);

    for (let i = 0; i < 3; ++i) {
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragments[i].ownerId).toEqual(testFragments[i].ownerId);
      expect(res.body.fragments[i].type).toEqual(testFragments[i].type);
      expect(res.body.fragments[i].created).toEqual(testFragments[i].created);
      expect(res.body.fragments[i].updated).toEqual(testFragments[i].updated);
      expect(res.body.fragments[i].size).toEqual(testFragments[i].size);
      expect(res.body.fragments[i].id).toEqual(testFragments[i].id);
    }
  });
});
