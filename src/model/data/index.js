if (process.env.USE_IN_MEMORY && process.env.USE_AWS_MEMORY) {
  throw new Error('env contains configuration for both AWS  and In Memory. Only one is allowed.');
}

if (process.env.USE_AWS_MEMORY == 'true') {
  module.exports = require('./aws');
} else if (process.env.USE_IN_MEMORY == 'true') {
  module.exports = require('./memory');
} else {
  throw new Error('missing env vars: no memory strategy configuration found');
}
