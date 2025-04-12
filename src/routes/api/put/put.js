const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');
const crypto = require('crypto');
const { createSuccessResponse, createErrorResponse } = require('../../../response');

const updateFragment = async (req, res) => {
  logger.debug(`User entered PUT: /v1/fragments/:${req.params.id}`);

  if (!Buffer.isBuffer(req.body) || req.body.length == 0) {
    logger.warn(`Invalid Buffer: ${req.body}`);
    const error = createErrorResponse(415, `Invalid Buffer: ${req.body}`);
    return res.status(415).json(error);
  }

  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];
  const ownerId = crypto.createHash('sha256').update(email).digest('hex');
  const type = req.get('Content-Type');
  let fragment;

  try {
    logger.debug('calling byId() in getFragmentsById() to get the fragments');
    const id = req.params.id.split('.')[0];

    fragment = await Fragment.byId(ownerId, id);
    logger.info({ fragment }, 'Returned Fragment');

    if (fragment.type !== type) {
      throw new Error(`A fragment's type cannot be changed after its created`);
    }
    fragment.setData(req.body);
  } catch (e) {
    logger.debug({ e }, 'error is ');
    if (e.message === `A fragment's type cannot be changed after its created`) {
      logger.warn(`Invalid Fragment ID: ${req.params.id}`);
      const error = createErrorResponse(400, `Invalid Fragment ID: ${req.params.id}: ${e.message}`);

      return res.status(400).json(error);
    } else {
      logger.warn(`Invalid Fragment ID: ${req.params.id}`);
      const error = createErrorResponse(404, `Invalid Fragment ID: ${req.params.id}: ${e.message}`);

      return res.status(404).json(error);
    }
  }

  const result = createSuccessResponse({ fragment: { ...fragment } });
  res.status(200).json(result);
};

module.exports = updateFragment;
