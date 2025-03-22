/// <summary>
/// This module is a test file for ../../src/routes/api/getFragments.js
/// </summary>

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/tmpID').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/tmpID')
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

    const id = res.body.fragment.id;
    res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(res.charset).toBe(undefined);
    expect(res.text).toEqual(testBuffer);
  });

  test('authenticated users get fragment with charset', async () => {
    // Send a buffer to the user
    const testBuffer = 'This is a fragment';
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send(testBuffer);

    const id = res.body.fragment.id;
    res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(res.charset).toBe('utf-8');
    expect(res.text).toEqual(testBuffer);
  });

  test('authorized user gets invalid fragment with bad ID', async () => {
    const res = await request(app).get(`/v1/fragments/badID`).auth('user1@email.com', 'password1');

    expect(res.status).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.statusCode).toBe(404);
  });

  test('markdown fragment converted to HTML', async () => {
    const testBuffer =
      `# H1 here\n` +
      `paragraph here\n\n` +
      `## H2 here\n\n` +
      `- l1 here\n` +
      `- l2 here\n` +
      `- l3 here`;

    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(testBuffer);

    const id = res.body.fragment.id;
    res = await request(app).get(`/v1/fragments/${id}.html`).auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(
      `<h1>H1 here</h1>\n` +
        `<p>paragraph here</p>\n` +
        `<h2>H2 here</h2>\n` +
        `<ul>\n` +
        `<li>l1 here</li>\n` +
        `<li>l2 here</li>\n` +
        `<li>l3 here</li>\n` +
        `</ul>\n`
    );
  });

  test('markdown fragment converted to incompatible type', async () => {
    const testBuffer =
      `# H1 here\n` +
      `paragraph here\n\n` +
      `## H2 here\n\n` +
      `- l1 here\n` +
      `- l2 here\n` +
      `- l3 here`;

    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(testBuffer);

    const id = res.body.fragment.id;
    res = await request(app)
      .get(`/v1/fragments/${id}.incompatible`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
    expect(res.body.error.message).toEqual(
      `Invalid Fragment ID: ${id}.incompatible: fragment of type text/markdown cannot be converted to type incompatible`
    );
  });
});
