const { Fragment } = require('../../../model/fragment');
const { Converter } = require('../../../model/fragment-converter');
const logger = require('../../../logger');
const crypto = require('crypto');
const { createErrorResponse } = require('../../../response');

const getFragmentsById = async (req, res) => {
  logger.debug(`User entered GET: /v1/fragments/:${req.params.id}`);

  const email = req.user?.email || req.headers.authorization?.split(' ')[1]?.split(':')[0];
  const ownerId = crypto.createHash('sha256').update(email).digest('hex');
  let result;
  let type;

  try {
    logger.debug('calling byId() in getFragmentsById() to get the fragments');
    const id = req.params.id.split('.')[0];
    const extensionType = req.params.id.split('.')[1];

    const fragment = await Fragment.byId(ownerId, id);
    type = fragment.type;
    const data = await fragment.getData();

    result = await Converter.ConvertToType(data, fragment, extensionType);
  } catch (e) {
    logger.warn(`Invalid Fragment ID: ${req.params.id}`);
    const error = createErrorResponse(404, `Invalid Fragment ID: ${req.params.id}: ${e.message}`);
    return res.status(404).json(error);
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': result.length,
  });

  res.end(result);
};

module.exports = getFragmentsById;
