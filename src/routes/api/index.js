/**
 * Main entry point for v1 version of the Fragments API
 */
const express = require('express');
// Defines a router which will mount our endpoints
const router = express.Router();

// :GET /v1/fragments
router.get('/fragments', require('../api/get'));

module.exports = router;
