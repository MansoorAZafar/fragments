//Globally define the configuration,
// so all other files can access it too
require('dotenv').config();
const logger = require('../src/logger');

//IFF crash due to an unexpected exception, log it first
process.on('uncaughtException', (err, origin) => {
  logger.fatal('Uncaught Exception: ', { err, origin });
  throw err;
});

//IFF crash for unhandled promise, log it
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal('Unhandled Rejection: ', { reason, promise });
  throw reason;
});

//Start the server
require('../src/server');
