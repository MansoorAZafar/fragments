const logger = require('../../logger');
const { createSuccessResponse } = require('../../response');

const getFragments = (req, res) => {
  logger.debug('User entered /v1/fragments');
  const data = { fragments: [] };
  const success = createSuccessResponse(data);

  res.status(200).json(success);
};

module.exports = getFragments;
