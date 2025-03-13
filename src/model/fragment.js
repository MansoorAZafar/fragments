// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  static supportedTypes = [
    'text/plain',
    'text/markdown',
    'text/html',
    'application/json',
    // 'image/png',
    // 'image/jpeg',
    // 'image/webp',
    // 'image/gif',
  ];

  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) throw new Error('ownerId and type are required');
    if (!Fragment.isSupportedType(type)) throw new Error(`${type} is not supported`);
    if (typeof size !== 'number' || size < 0) throw new Error('Size must be a whole number');

    this.ownerId = ownerId;
    this.type = type;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.size = size;
    this.id = id || randomUUID();
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);
    if (expand) {
      // Use Promise.all to resolve all the promises in the array returned by map
      return Promise.all(
        fragments.map(async (fragment) => {
          const frag = new Fragment({
            id: fragment.id,
            ownerId: fragment.ownerId,
            type: fragment.type,
            created: fragment.created,
            updated: fragment.updated,
            size: fragment.size,
          });
          return frag;
        })
      );
    }
    return Promise.resolve(fragments);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const rawFragment = await readFragment(ownerId, id);
    if (!rawFragment) {
      throw new Error(`Fragment doesn't exist with ownerId: ${ownerId} and id: ${id}`);
    }

    return Promise.resolve(new Fragment(rawFragment));
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    deleteFragment(ownerId, id);
    return Promise.resolve();
  }

  /**
   * Saves the current fragment (metadata) to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    writeFragment(this);
    return Promise.resolve();
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    const storedFragment = readFragmentData(this.ownerId, this.id);
    return Promise.resolve(storedFragment);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('setData must be passed a buffer');
    }
    this.size = data.length;
    this.updated = new Date().toISOString();

    await writeFragmentData(this.ownerId, this.id, data);
    await this.save();
    return Promise.resolve();
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const { parameters } = contentType.parse(this.type);
    return parameters !== undefined;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return [this.mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return Fragment.supportedTypes.includes(contentType.parse(value).type);
  }
}

module.exports.Fragment = Fragment;
