const { Fragment } = require('../../../model/fragment');
const logger = require('../../../logger');
const crypto = require('crypto');
const { createErrorResponse, createSuccessResponse } = require('../../../response');

const deleteFragmentById = async (req, res) => {
  logger.debug(`User entered GET: /v1/fragments/:${req.params.id}`);

  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];
  const ownerId = crypto.createHash('sha256').update(email).digest('hex');

  try {
    logger.debug('deleting fragment');
    const id = req.params.id.split('.')[0];

    await Fragment.delete(ownerId, id);
  } catch (e) {
    logger.warn(`Invalid Fragment ID: ${req.params.id}`);
    const error = createErrorResponse(404, `Invalid Fragment ID: ${req.params.id}: ${e.message}`);
    return res.status(404).json(error);
  }

  return res.json(createSuccessResponse());
};

module.exports = deleteFragmentById;
