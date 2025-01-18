const logger = require('../../logger');

const getFragments = (req, res) => {
  logger.debug('User entered /v1/fragments');
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
};

module.exports = getFragments;
