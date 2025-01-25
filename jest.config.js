//Get the full path to env.jest
const path = require('path');
const envFile = path.join(__dirname, 'env.jest');

// Read env vars
require('dotenv').config({ path: envFile });

// Log to mention how to see more details
console.log(`Using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' in env.jest for more details`);

// Jest options setup
module.exports = {
  verbose: true,
  testTimeout: 5000,
};
