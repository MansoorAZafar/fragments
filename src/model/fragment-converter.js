const Markdownit = require('markdown-it');
const md = new Markdownit();

class Converter {
  static supportedConversions = {
    'text/markdown': ['md', 'html', 'txt'],
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

    if (type == undefined) {
      return Promise.resolve(actualData);
    }

    if (!this.isSupported(fragment.type, type)) {
      throw new Error(`fragment of type ${fragment.type} cannot be converted to type ${type}`);
    }

    let res;
    switch (fragment.type) {
      case 'text/markdown':
        res = await Converter.convertMarkdown(actualData, type);
        break;
    }

    return Promise.resolve(res);
  }

  static async convertMarkdown(data, type) {
    let res;

    switch (type) {
      case 'html':
        res = md.render(data);
        break;
      default:
        res = data;
    }

    return res;
  }
}

module.exports.Converter = Converter;
