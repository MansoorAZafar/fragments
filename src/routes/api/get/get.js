const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../../response');
const crypto = require('crypto');

const getFragments = (req, res) => {
  logger.debug('User entered GET: /v1/fragments');
  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];

  if (!email) {
    logger.warn(`Invalid email was provided: ${email}`);
    const error = createErrorResponse(404, `Invalid email was provided: ${email}`);
    return res.status(404).json(error);
  }

  const ownerId = crypto.createHash('sha256').update(email).digest('hex');
  const data = { fragments: [Fragment.byUser(ownerId)] };
  const success = createSuccessResponse(data);

  return res.status(200).json(success);
};

module.exports = getFragments;
