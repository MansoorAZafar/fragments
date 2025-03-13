const { Fragment } = require('../../../model/fragment');
const logger = require('../../../logger');
const crypto = require('crypto');
const { createSuccessResponse, createErrorResponse } = require('../../../response');

const getFragmentsByIdInfo = async (req, res) => {
  logger.debug(`User entered GET: /v1/fragments/:${req.params.id}`);

  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];
  const ownerId = crypto.createHash('sha256').update(email).digest('hex');
  let fragment;

  try {
    logger.debug('calling byId() in getFragmentsById() to get the fragments');
    const id = req.params.id.split('.')[0];

    fragment = await Fragment.byId(ownerId, id);
  } catch (e) {
    logger.warn(`Invalid Fragment ID: ${req.params.id}`);
    const error = createErrorResponse(404, `Invalid Fragment ID: ${req.params.id}: ${e.message}`);
    return res.status(404).json(error);
  }

  const success = createSuccessResponse(fragment);
  return res.status(200).json(success);
};

module.exports = getFragmentsByIdInfo;
