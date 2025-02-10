const { Fragment } = require('../../../model/fragment');
const contentType = require('content-type');
const logger = require('../../../logger');
const crypto = require('crypto');
const { createSuccessResponse, createErrorResponse } = require('../../../response');

const createFragment = async (req, res) => {
  logger.debug('User entered POST: /v1/fragments');

  if (!Buffer.isBuffer(req.body)) {
    logger.warn(`Invalid Buffer: ${req.body}`);
    const error = createErrorResponse(415, `Invalid Buffer: ${req.body}`);
    return res.status(415).json(error);
  }

  const { type } = contentType.parse(req);
  if (!Fragment.isSupportedType(type)) {
    logger.warn(`Unsupported Content Type: ${type}`);
    const error = createErrorResponse(415, `Unsupported Content Type: ${type}`);
    return res.status(415).json(error);
  }

  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];
  if (!email) {
    logger.warn(`Invalid email was provided: ${email}`);
    const error = createErrorResponse(404, `Invalid email was provided: ${email}`);
    return res.status(404).json(error);
  }

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
