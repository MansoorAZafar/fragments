/**
 * Main entry point for v1 version of the Fragments API
 */
const express = require('express');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');
// Defines a router which will mount our endpoints
const router = express.Router();

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      logger.debug({ type }, ' is the type');
      logger.debug(Fragment.isSupportedType(type), ': Frag.isSupported');
      return Fragment.isSupportedType(type);
    },
  });

// :GET /v1/fragments
router.get('/fragments', require('./get/get'));
router.get('/fragments/:id', require('./get/getFragmentsById'));
router.get('/fragments/:id/info', require('./get/getFragmentsByIdInfo'));
router.delete('/fragments/:id', require('./delete/delete'));

// :POST /v1/fragments
router.post('/fragments', rawBody(), require('../api/post/post'));

module.exports = router;
