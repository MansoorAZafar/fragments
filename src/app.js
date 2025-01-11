/*
 *****************
 * LIBRARY GUIDE *
 *****************
 * Express:
 *   - Creates actual App instance
 *     - lets us attach middleware and HTTP routes
 * CORS:
 *   - Allows for cross origin requests
 * Helmet:
 *   - Automatic security middleware
 * Compression:
 *   - Reduces size of response data
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { author, version } = require('../package.json');

//Setup of pino & custom logger
const logger = require('../src/logger');
const pino = require('pino-http')({
  logger,
});

//app setup
const app = express();

app.use(pino);
app.use(cors());
app.use(helmet());
app.use(compression());

/**
 * @description: A Simple server health check
 * @return {[res.status]} 200 if the server is ok, anything else if bad
 */
app.get('/', (req, res) => {
  logger.debug(`User entered Route '/'`);
  // Clients always fetch this fresh
  // 'compression' Will never compress this
  // https://expressjs.com/id/resources/middleware/compression.html
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/MansoorAZafar/fragments',
    version,
  });
});

// 404 middleware to handle any requests for resources that can't be found
/**
 * @description: 404 middleware to handle any request for not found resources
 * @returns {[res.status(404)]} 404 error response
 */
app.use((req, res) => {
  logger.debug(`User went to 404 Middleware`);
  res.status(404).json({
    status: 'error',
    error: {
      message: 'resource not found',
      code: 404,
    },
  });
});

/**
 * @description Error handling middleware for anything else
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If server error: Log it
  if (status > 409) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

//Export the application to be used in server.js
module.exports = app;
