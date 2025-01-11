const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  log_level: process.env.LOG_LEVEL,
};
