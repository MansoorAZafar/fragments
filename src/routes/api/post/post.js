const { Fragment } = require('../../../model/fragment');
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

  const type = req.get('Content-Type');
  logger.debug('type is: ', type);

  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];
  logger.debug('email is: ', email);

  const ownerId = crypto.createHash('sha256').update(email).digest('hex');
  const fragment = new Fragment({
    ownerId,
    type,
  });

  await fragment.setData(req.body);
  await fragment.save();

  const success = createSuccessResponse({ fragment: { ...fragment, data: req.body } });

  const protocol = req.protocol || 'http';
  const baseURL = process.env.API_URL || `${protocol}://${req.headers.host}`;
  const fragmentURL = new URL(`/v1/fragments/${fragment.id}`, baseURL.toString());

  res.setHeader('Location', fragmentURL);
  return res.status(201).json(success);
};

module.exports = createFragment;
