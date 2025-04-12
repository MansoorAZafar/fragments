const { Converter } = require('../../src/model/fragment-converter');
const sharp = require('sharp'); // Helps make test images

describe('Fragment Converter class', () => {
  test('unsupported type should throw', async () => {
    await expect(async () => {
      await Converter.ConvertToType('test', { type: 'test' }, 'not applicable');
    }).rejects.toThrow('Cannot convert test to not applicable');
  });

  test('if type is undefined, should return itself', async () => {
    const data = 'test';
    const fragment = { type: 'test' };

    const res = await Converter.ConvertToType(data, fragment);
    expect(res).toEqual(data);
  });

  // Text/*
  describe('testing text/* conversions', () => {
    // Text/Plain
    describe('testing text/plain conversions', () => {
      const fragment = { type: 'text/plain' };

      test('test text/plain to txt', async () => {
        const data = 'test';
        const type = 'txt';

        const res = await Converter.ConvertToType(data, fragment, type);
        expect(res).toEqual(data);
      });

      test('test text/plain to incompatible type', async () => {
        await expect(async () => {
          await Converter.ConvertToType('test', fragment, 'jpg');
        }).rejects.toThrow('Cannot convert text/plain to jpg');
      });
    });

    // Text/Markdown
    describe('testing text/markdown conversions', () => {
      const fragment = { type: 'text/markdown' };
      const data = '# Hello!\n' + '## How are you\n' + 'This is World\n';

      test('test text/markdown to md', async () => {
        const type = 'md';

        const res = await Converter.ConvertToType(data, fragment, type);
        expect(res).toEqual(data);
      });

      test('test text/markdown to html', async () => {
        const type = 'html';

        const expectedData =
          '<h1>Hello!</h1>\n' + '<h2>How are you</h2>\n' + '<p>This is World</p>\n';
        const res = await Converter.ConvertToType(data, fragment, type);
        expect(res).toEqual(expectedData);
      });

      test('test text/markdown to txt', async () => {
        const type = 'txt';

        const expectedData = 'Hello!\n' + 'How are you\n' + 'This is World\n';
        const res = await Converter.ConvertToType(data, fragment, type);
        expect(res).toEqual(expectedData);
      });

      test('test text/markdown to unsupported type', async () => {
        await expect(async () => {
          await Converter.ConvertToType('test', fragment, 'jpg');
        }).rejects.toThrow('Cannot convert text/markdown to jpg');
      });
    });

    // Text/HTML
    describe('testing text/html conversions', () => {
      const fragment = { type: 'text/html' };
      const data = '<h1>Hello!</h1>\n' + '<h2>How are you</h2>\n' + '<p>This is World</p>\n';

      test('test text/html to html', async () => {
        const type = 'html';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(data);
      });

      test('test text/html to txt', async () => {
        const expectedData = 'Hello!\n' + 'How are you\n' + 'This is World\n';
        const type = 'txt';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(expectedData);
      });

      test('test text/html to unsupported type', async () => {
        await expect(async () => {
          await Converter.ConvertToType(data, fragment, 'jpg');
        }).rejects.toThrow('Cannot convert text/html to jpg');
      });
    });

    // Text/CSV
    describe('testing text/csv conversions', () => {
      const fragment = { type: 'text/csv' };
      const data = 'hello,world\n' + 'how,are\n' + 'you,?\n';

      test('test text/csv to csv', async () => {
        const type = 'csv';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(data);
      });

      test('test text/csv to txt', async () => {
        const expectedData = 'hello world\n' + 'how are\n' + 'you ?\n';
        const type = 'txt';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(expectedData);
      });

      test('test text/csv to json', async () => {
        const expectedData = JSON.stringify([
          { hello: 'how', world: 'are' },
          { hello: 'you', world: '?' },
          { hello: '' },
        ]);
        const type = 'json';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(expectedData);
      });

      test('test text/csv to unsupported type', async () => {
        await expect(async () => {
          await Converter.ConvertToType(data, fragment, 'jpg');
        }).rejects.toThrow('Cannot convert text/csv to jpg');
      });
    });
  });

  describe('testing application/* conversion', () => {
    //
    describe('testing application/json conversions', () => {
      //
      const fragment = { type: 'application/json' };
      const data = `{"hello": "world", "id": "key", "names": {"a": "bob", "b": "brocacho"}}`;

      test('test application/json to json', async () => {
        const type = 'json';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(data);
      });

      test('test application/json to yaml', async () => {
        const expectedData =
          'hello: world\n' + 'id: key\n' + 'names:\n' + '  a: bob\n' + '  b: brocacho\n';
        const type = 'yaml';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(expectedData);
      });

      test('test application/json to yml', async () => {
        const expectedData =
          'hello: world\n' + 'id: key\n' + 'names:\n' + '  a: bob\n' + '  b: brocacho\n';
        const type = 'yml';
        const res = await Converter.ConvertToType(data, fragment, type);
        expect(res).toEqual(expectedData);
      });

      test('test application/json to txt', async () => {
        const expectedData = `{"hello":"world","id":"key","names":{"a":"bob","b":"brocacho"}}`;

        const type = 'txt';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(expectedData);
      });

      test('test application/json to unsupported type', async () => {
        await expect(async () => {
          await Converter.ConvertToType(data, fragment, 'jpg');
        }).rejects.toThrow('Cannot convert application/json to jpg');
      });
      //
    });

    describe('testing application/yaml conversions', () => {
      const fragment = { type: 'application/yaml' };
      const data =
        'name: Brocacho\n' +
        'id: 12345\n' +
        'health: 50\n' +
        'hobbies: \n' +
        '  - reading\n' +
        '  - coding\n' +
        '  - gaming\n';

      test('testing application/yaml to yaml', async () => {
        const type = 'yaml';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(data);
      });

      test('testing application/yaml to txt', async () => {
        const expectedData = `{"name":"Brocacho","id":12345,"health":50,"hobbies":["reading","coding","gaming"]}`;
        const type = 'txt';
        const res = await Converter.ConvertToType(data, fragment, type);

        expect(res).toEqual(expectedData);
      });

      test('test application/yaml to unsupported type', async () => {
        await expect(async () => {
          await Converter.ConvertToType(data, fragment, 'jpg');
        }).rejects.toThrow('Cannot convert application/yaml to jpg');
      });
    });

    describe('testing image/* conversion', () => {
      // Image/PNG
      describe('testing image/png conversions', () => {
        const fragment = { type: 'image/png' };
        let data;

        beforeEach(async () => {
          data = await sharp({
            create: {
              width: 1,
              height: 1,
              channels: 3,
              background: { r: 255, g: 0, b: 0 },
            },
          })
            .png()
            .toBuffer();
        });

        afterEach(() => {
          data = null;
        });

        test('testing image/png to png', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'png');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('png');
        });

        test('testing image/png to jpeg', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'jpg');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('jpeg');
        });

        test('testing image/png to webp', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'webp');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('webp');
        });

        test('testing image/png to gif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'gif');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('gif');
        });

        test('testing image/png to avif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'avif');
          const metadata = await sharp(result).metadata();

          expect(['avif', 'heif']).toContain(metadata.format);
        });

        test('testing image/png to unsupported type', async () => {
          await expect(async () => {
            await Converter.ConvertToType(data, fragment, 'txt');
          }).rejects.toThrow('Cannot convert image/png to txt');
        });
      });

      // Image/JPEG
      describe('testing image/jpeg conversions', () => {
        const fragment = { type: 'image/jpeg' };
        let data;

        beforeEach(async () => {
          data = await sharp({
            create: {
              width: 1,
              height: 1,
              channels: 3,
              background: { r: 255, g: 0, b: 0 },
            },
          })
            .jpeg()
            .toBuffer();
        });

        afterEach(() => {
          data = null;
        });

        test('testing image/jpg to png', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'png');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('png');
        });

        test('testing image/jpg to jpeg', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'jpg');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('jpeg');
        });

        test('testing image/jpeg to webp', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'webp');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('webp');
        });

        test('testing image/jpeg to gif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'gif');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('gif');
        });

        test('testing image/jpeg to avif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'avif');
          const metadata = await sharp(result).metadata();

          expect(['avif', 'heif']).toContain(metadata.format);
        });

        test('testing image/jpeg to unsupported type', async () => {
          await expect(async () => {
            await Converter.ConvertToType(data, fragment, 'txt');
          }).rejects.toThrow('Cannot convert image/jpeg to txt');
        });
      });

      // Image/WEBP
      describe('testing image/webp conversions', () => {
        const fragment = { type: 'image/webp' };
        let data;

        beforeEach(async () => {
          data = await sharp({
            create: {
              width: 1,
              height: 1,
              channels: 3,
              background: { r: 255, g: 0, b: 0 },
            },
          })
            .webp()
            .toBuffer();
        });

        afterEach(() => {
          data = null;
        });

        test('testing image/webp to png', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'png');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('png');
        });

        test('testing image/webp to jpeg', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'jpg');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('jpeg');
        });

        test('testing image/webp to webp', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'webp');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('webp');
        });

        test('testing image/webp to gif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'gif');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('gif');
        });

        test('testing image/webp to avif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'avif');
          const metadata = await sharp(result).metadata();

          expect(['avif', 'heif']).toContain(metadata.format);
        });

        test('testing image/webp to unsupported type', async () => {
          await expect(async () => {
            await Converter.ConvertToType(data, fragment, 'txt');
          }).rejects.toThrow('Cannot convert image/webp to txt');
        });
      });

      // Image/gif
      describe('testing image/gif conversions', () => {
        const fragment = { type: 'image/gif' };
        let data;

        beforeEach(async () => {
          data = await sharp({
            create: {
              width: 1,
              height: 1,
              channels: 3,
              background: { r: 255, g: 0, b: 0 },
            },
          })
            .gif()
            .toBuffer();
        });

        afterEach(() => {
          data = null;
        });

        test('testing image/gif to png', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'png');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('png');
        });

        test('testing image/gif to jpeg', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'jpg');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('jpeg');
        });

        test('testing image/gif to webp', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'webp');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('webp');
        });

        test('testing image/gif to gif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'gif');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('gif');
        });

        test('testing image/gif to avif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'avif');
          const metadata = await sharp(result).metadata();

          expect(['avif', 'heif']).toContain(metadata.format);
        });

        test('testing image/gif to unsupported type', async () => {
          await expect(async () => {
            await Converter.ConvertToType(data, fragment, 'txt');
          }).rejects.toThrow('Cannot convert image/gif to txt');
        });
      });

      // Image/avif
      describe('testing image/avif conversions', () => {
        const fragment = { type: 'image/avif' };
        let data;

        beforeEach(async () => {
          data = await sharp({
            create: {
              width: 1,
              height: 1,
              channels: 3,
              background: { r: 255, g: 0, b: 0 },
            },
          })
            .avif()
            .toBuffer();
        });

        afterEach(() => {
          data = null;
        });

        test('testing image/avif to png', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'png');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('png');
        });

        test('testing image/avif to jpeg', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'jpg');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('jpeg');
        });

        test('testing image/avif to webp', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'webp');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('webp');
        });

        test('testing image/avif to gif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'gif');
          const metadata = await sharp(result).metadata();

          expect(metadata.format).toBe('gif');
        });

        test('testing image/avif to avif', async () => {
          const result = await Converter.ConvertToType(data, fragment, 'avif');
          const metadata = await sharp(result).metadata();

          expect(['avif', 'heif']).toContain(metadata.format);
        });

        test('testing image/avif to unsupported type', async () => {
          await expect(async () => {
            await Converter.ConvertToType(data, fragment, 'txt');
          }).rejects.toThrow('Cannot convert image/avif to txt');
        });
      });
    });
  });
});
