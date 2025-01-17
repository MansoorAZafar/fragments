// const getFragments = (req, res) => {
//   res.status(200).json({
//     status: 'ok',
//     fragments: [],
//   });
// };
//const logger = require('../../logger');

module.exports = (req, res) => {
  //logger.debug('User Entered /v1/fragments GET');
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
};
