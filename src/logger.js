const { log_level } = require('../src/configuration');
const options = { level: log_level || 'info' };

if (options.level == 'debug') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

module.exports = require('pino')(options);
