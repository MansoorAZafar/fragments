const { Fragment } = require('../../../model/fragment');
const contentType = require('content-type');
const logger = require('../../../logger');
const crypto = require('crypto');
const { createSuccessResponse, createErrorResponse } = require('../../../response');

const createFragment = async (req, res) => {
  logger.debug('User entered POST: /v1/fragments');
  logger.debug(Buffer.isBuffer(req.body), ': Is buffer');

  if (!Buffer.isBuffer(req.body)) {
    logger.warn(`Invalid Buffer: ${req.body}`);
    const error = createErrorResponse(415, `Invalid Buffer: ${req.body}`);
    return res.status(415).json(error);
  }

  const { type } = contentType.parse(req);
  logger.debug('type is: ', type);

  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];
  logger.debug('email is: ', email);

  const ownerId = crypto.createHash('sha256').update(email).digest('hex');
  const fragment = new Fragment({
    ownerId,
    type,
    size: req.body.length,
  });

  await fragment.save();
  await fragment.setData(req.body);

  const success = createSuccessResponse({ ...fragment, data: req.body });

  const protocol = req.protocol || 'http';
  const baseURL = process.env.API_URL || `${protocol}://${req.headers.host}`;
  const fragmentURL = new URL(`/v1/fragment/${fragment.id}`, baseURL.toString());

  res.setHeader('Location', fragmentURL);
  return res.status(201).json(success);
};

module.exports = createFragment;
