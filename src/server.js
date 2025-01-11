const { port } = require('../src/configuration');
const stoppable = require('stoppable');
const logger = require('../src/logger');
const app = require('../src/app');

// Default the port to 8080
const server_port = parseInt(port || '8080', 10);

const server = stoppable(
  app.listen(server_port, () => {
    logger.info(`Server started on port: ${port}`);
  })
);

module.exports = server;
