const MarkdownIt = require('markdown-it');
const stripTags = require('striptags');
const Papa = require('papaparse');
const yaml = require('js-yaml');
const sharp = require('sharp');

const md = new MarkdownIt();

class Converter {
  static supportedConversions = {
    'text/plain': ['txt'],
    'text/markdown': ['md', 'html', 'txt'],
    'text/html': ['html', 'txt'],
    'text/csv': ['csv', 'txt', 'json'],
    'application/json': ['json', 'yaml', 'yml', 'txt'],
    'application/yaml': ['yaml', 'txt'],
    'image/png': ['png', 'jpg', 'webp', 'gif', 'avif'],
    'image/jpeg': ['png', 'jpg', 'webp', 'gif', 'avif'],
    'image/webp': ['png', 'jpg', 'webp', 'gif', 'avif'],
    'image/gif': ['png', 'jpg', 'webp', 'gif', 'avif'],
    'image/avif': ['png', 'jpg', 'webp', 'gif', 'avif'],
  };

  /**
   *
   * @param {string} srcType  : the type of the source fragment
   * @param {string} destType : the type of the desired fragment
   * @returns {bool} whether the type is supported for converting
   */
  static isSupported(srcType, destType) {
    return Converter.supportedConversions[srcType]?.includes(destType);
  }

  /**
   * Converts the fragment to the desired type
   * @param {*} data: the data being converted
   * @param {Fragment} fragment : the fragment to be converted
   * @param {string} type       : the extension to convert to (.md, .txt. .html ...)
   * @returns Promise<?> the type
   */
  static async ConvertToType(data, fragment, type) {
    const actualData = data.toString();
    const { type: srcType } = fragment;

    if (type == undefined) {
      return Promise.resolve(actualData);
    }

    if (!type || !this.isSupported(srcType, type)) {
      throw new Error(`Cannot convert ${srcType} to ${type}`);
    }

    if (srcType.startsWith('text/')) {
      return this.ConvertText(srcType, actualData, type);
    }
    if (srcType.startsWith('application/')) {
      return this.ConvertApplication(srcType, actualData, type);
    }
    if (srcType.startsWith('image/')) {
      return this.ConvertImage(data, type); // original buffer needed
    }

    throw new Error(`Unsupported fragment type: ${srcType}`);
  }

  static async ConvertText(type, data, target) {
    switch (type) {
      case 'text/markdown':
        return this.convertMarkdown(data, target);
      case 'text/html':
        return this.convertHTML(data, target);
      case 'text/csv':
        return this.convertCSV(data, target);
      case 'text/plain':
        return data;
      default:
        return data;
    }
  }

  static async ConvertApplication(type, data, target) {
    switch (type) {
      case 'application/json':
        return this.convertJSON(data, target);
      case 'application/yaml':
        return this.convertYAML(data, target);
      default:
        return data;
    }
  }

  static async ConvertImage(buffer, targetFormat) {
    return sharp(buffer).toFormat(targetFormat).toBuffer();
  }

  // -------------------------------
  // TEXT CONVERSION HELPERS
  // -------------------------------
  static convertMarkdown(data, type) {
    switch (type) {
      case 'html':
        return md.render(data);
      case 'txt':
        return stripTags(md.render(data));
      default:
        return data;
    }
  }

  static convertHTML(data, type) {
    if (type === 'txt') {
      return stripTags(data);
    }
    return data;
  }

  static convertCSV(data, type) {
    const parsed = Papa.parse(data, { header: type === 'json', skipEmptyLines: false });

    switch (type) {
      case 'json':
        return JSON.stringify(parsed.data);
      case 'txt':
        return parsed.data
          .map((row) => (Array.isArray(row) ? row.join(' ') : Object.values(row).join(' ')))
          .join('\n');
      default:
        return data;
    }
  }

  static convertJSON(data, type) {
    const obj = JSON.parse(data);

    switch (type) {
      case 'yaml':
      case 'yml':
        return yaml.dump(obj);
      case 'txt':
        return JSON.stringify(obj);
      default:
        return data;
    }
  }

  static convertYAML(data, type) {
    const obj = yaml.load(data);

    switch (type) {
      case 'json':
        return JSON.stringify(obj);
      case 'txt':
        return JSON.stringify(obj);
      default:
        return data;
    }
  }
}

module.exports.Converter = Converter;
