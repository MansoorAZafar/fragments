const stoppable = require('stoppable');
const logger = require('../src/logger');
const app = require('../src/app');

// Default the port to 8080
const port = parseInt(process.env.PORT || '8080', 10);

const printENVVariables = () => {
  logger.debug(`ENV_Port: ${port}\nLog_Level: ${process.env.LOG_LEVEL}`);
};

const server = stoppable(
  app.listen(port, () => {
    printENVVariables();
    logger.info(`Server started on port: ${port}`);
  })
);

module.exports = server;
