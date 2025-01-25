const express = require('express');
const logger = require('../logger');
const router = express.Router();
const { author, version } = require('../../package.json');
const { authenticate } = require('../auth');
const { createSuccessResponse } = require('../response');

router.use(`/v1`, authenticate(), require('../routes/api'));

/**
 * @description: A Simple server health check
 * @return {[res.status]} 200 if the server is ok, anything else if bad
 */
router.get('/', (req, res) => {
  logger.debug(`User entered Route '/'`);
  // Clients always fetch this fresh
  // 'compression' Will never compress this
  // https://expressjs.com/id/resources/middleware/compression.html
  res.setHeader('Cache-Control', 'no-cache');

  const data = {
    author,
    githubUrl: 'https://github.com/MansoorAZafar/fragments',
    version,
  };
  const success = createSuccessResponse(data);

  res.status(200).json(success);
});

module.exports = router;
