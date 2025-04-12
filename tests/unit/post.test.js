/// <summary>
/// This module is a test file for ../../src/routes/api/post.js
/// </summary>

const request = require('supertest');
const app = require('../../src/app');
const sharp = require('sharp');

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

  describe('creating different types of fragments', () => {
    // Creating a Text/Plain fragment

    test('authenticated user making a Text Plain fragment', async () => {
      const testBuffer = 'brochacho whats good';
      const data = Buffer.from(testBuffer);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(testBuffer);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('text/plain');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Text/Markdown fragment

    test('authenticated user making a HTML fragment', async () => {
      const testBuffer = '# Sup\n ## Header 2 yoo\n bro what';
      const data = Buffer.from(testBuffer);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(testBuffer);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('text/markdown');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Text/HTML fragment

    test('authenticated user making a HTML fragment', async () => {
      const testBuffer = '<h1>Header</h1>\n<p>yoo wsg</p>';
      const data = Buffer.from(testBuffer);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(testBuffer);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('text/html');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Text/CSV fragment

    test('authenticated user making a CSV fragment', async () => {
      const testBuffer = 'data,hello\nwhats,good';
      const data = Buffer.from(testBuffer);
      const res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/csv')
        .send(testBuffer);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('text/csv');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Application/JSON fragment

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

    // Creating a Application/YAML fragment

    test('authenticated user making a application/yaml fragment', async () => {
      const testBuffer =
        `name: "Jane Doe"\n` +
        `age: 50\n` +
        `work:\n` +
        `  - Agent\n` +
        `  - Coder\n` +
        `  - Ninja\n`;
      const data = Buffer.from(testBuffer);
      let res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/yaml')
        .send(data);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('application/yaml');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Image/PNG fragment

    test('authenticated user making a PNG fragment', async () => {
      const testBuffer = await sharp({
        create: {
          width: 1,
          height: 1,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .png()
        .toBuffer();
      const data = Buffer.from(testBuffer);
      let res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/png')
        .send(data);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('image/png');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Image/JPEG fragment

    test('authenticated user making a JPEG fragment', async () => {
      const testBuffer = await sharp({
        create: {
          width: 1,
          height: 1,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();
      const data = Buffer.from(testBuffer);
      let res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/jpeg')
        .send(data);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('image/jpeg');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Image/WEBP fragment

    test('authenticated user making a WEBP fragment', async () => {
      const testBuffer = await sharp({
        create: {
          width: 1,
          height: 1,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .webp()
        .toBuffer();
      const data = Buffer.from(testBuffer);
      let res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/webp')
        .send(data);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('image/webp');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Image/GIF fragment

    test('authenticated user making a GIF fragment', async () => {
      const testBuffer = await sharp({
        create: {
          width: 1,
          height: 1,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .gif()
        .toBuffer();
      const data = Buffer.from(testBuffer);
      let res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/gif')
        .send(data);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('image/gif');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });

    // Creating a Image/AVIF fragment

    test('authenticated user making a AVIF fragment', async () => {
      const testBuffer = await sharp({
        create: {
          width: 1,
          height: 1,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .avif()
        .toBuffer();
      const data = Buffer.from(testBuffer);
      let res = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'image/avif')
        .send(data);

      expect(res.headers['location']).toContain(`v1/fragments/${res.body.fragment.id}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.fragment.id).toBeDefined();
      expect(res.body.fragment.ownerId).toBeDefined();
      expect(res.body.fragment.type).toBe('image/avif');
      expect(res.body.fragment.created).toBeDefined();
      expect(res.body.fragment.updated).toBeDefined();
      expect(res.body.fragment.size).toEqual(testBuffer.length);
      expect(res.body.fragment.data.type).toEqual('Buffer');
      expect(res.body.fragment.data.data).toEqual(Array.from(data));
    });
  });

  test('invalid buffer', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/msword')
      .expect(415);
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
