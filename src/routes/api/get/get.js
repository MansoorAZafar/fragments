const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');
const { createSuccessResponse } = require('../../../response');
const crypto = require('crypto');

const getFragments = async (req, res) => {
  logger.debug('User entered GET: /v1/fragments');
  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];

  const ownerId = crypto.createHash('sha256').update(email).digest('hex');
  const data = { fragments: await Fragment.byUser(ownerId, true) };
  const success = createSuccessResponse(data);

  return res.status(200).json(success);
};

module.exports = getFragments;
