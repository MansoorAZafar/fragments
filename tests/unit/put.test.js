/// <summary>
/// This module is a test file for ../../src/routes/api/put/put.js
/// </summary>

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).put('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair create a fragment
  test('updating fragment but with different content type', async () => {
    let testBuffer = 'This is a fragment';
    let data = Buffer.from(testBuffer);
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const id = res.body.fragment.id;
    //Checking for the host is too dynamic, so we just check if it has the important content
    expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.id).toEqual(id);
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.size).toBe(testBuffer.length);
    expect(res.body.fragment.data.type).toEqual('Buffer');
    expect(res.body.fragment.data.data).toEqual(Array.from(data));

    testBuffer = '<h1> hello </h1>';
    data = Buffer.from(testBuffer);
    res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data)
      .expect(400);
  });

  test('updating fragment but with no buffer', async () => {
    const testBuffer = 'This is a fragment';
    const data = Buffer.from(testBuffer);
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const id = res.body.fragment.id;
    //Checking for the host is too dynamic, so we just check if it has the important content
    expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.id).toEqual(id);
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.size).toBe(testBuffer.length);
    expect(res.body.fragment.data.type).toEqual('Buffer');
    expect(res.body.fragment.data.data).toEqual(Array.from(data));

    res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .expect(415);
  });

  test('update a fragment', async () => {
    let testBuffer = 'This is a fragment';
    let data = Buffer.from(testBuffer);
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const id = res.body.fragment.id;
    const originalFragment = res.body.fragment;
    //Checking for the host is too dynamic, so we just check if it has the important content
    expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.id).toEqual(id);
    expect(res.body.fragment.ownerId).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.size).toBe(testBuffer.length);
    expect(res.body.fragment.data.type).toEqual('Buffer');
    expect(res.body.fragment.data.data).toEqual(Array.from(data));

    testBuffer = 'This is an UPDATED fragment';
    data = Buffer.from(testBuffer);
    res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data)
      .expect(200);

    const updatedFragment = res.body.fragment;
    expect(originalFragment.id).toEqual(updatedFragment.id);
    expect(originalFragment.type).toEqual(updatedFragment.type);
    expect(originalFragment.ownerId).toEqual(updatedFragment.ownerId);

    res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res.text).toEqual(testBuffer);
  });
});
