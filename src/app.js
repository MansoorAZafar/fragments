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
 * Passport:
 *   - Supports implementing authentication & authorization
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const authenticate = require('../src/auth');
const { createErrorResponse } = require('./response');

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
//Setup passport authentication middleware
passport.use(authenticate.strategy());
app.use(passport.initialize());

//Declare the routes
/**
 * @description: A Simple server health check
 * @return {[res.status]} 200 if the server is ok, anything else if bad
 */
app.use('/', require('../src/routes'));

// 404 middleware to handle any requests for resources that can't be found
/**
 * @description: 404 middleware to handle any request for not found resources
 * @returns {[res.status(404)]} 404 error response
 */
app.use((req, res) => {
  logger.debug(`User went to 404 Middleware`);

  const errorCode = 404;
  const errorMsg = 'resource not found';
  const error = createErrorResponse(errorCode, errorMsg);

  res.status(404).json(error);
});

/**
 * @description Error handling middleware for anything else
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';
  const error = createErrorResponse(status, message);

  // If server error: Log it
  if (status > 409) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json(error);
});

//Export the application to be used in server.js
module.exports = app;
