// Configure JWT token strategy for Passport to be based on
// Identity Token provided by Cognito.
// Token will be parsed by Authorization Header ( Bearer Token ).

// security configurations
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer');
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const logger = require('../src/logger');

// We expect AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID to be defined.
if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
  throw new Error('missing expected env vars: AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID');
}

// Creates a Cognito JWT Verifier
//  -> Will confirm any JWT we get from a user
//     is valid and something we can trust
// https://github.com/awslabs/aws-jwt-verify#cognitojwtverifier-verify-parameters
const jwtVerifier = CognitoJwtVerifier.create({
  //.env variables
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  // We expect a Identity Token (vs Access Token)
  tokenUse: 'id',
});

logger.info(`Configured to use AWS Cognito for Authorization`);

// Upon startup:
// 1. Download and cache the public keys (JWKS)
//  -> needed to verify our Cognito's JWT
// Try it yourself: // curl https://cognito-idp.us-east-1.amazonaws.com/<user-pool-id>/.well-known/jwks.json
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS successfully cached');
  })
  .catch((err) => {
    logger.error(`${err} Unable cache Cognito JWKS`);
  });

module.exports.strategy = () =>
  // We look for Bearer Token in the Authorization header,
  // Then, we verify with our Cognito JWT Verifier
  new BearerStrategy(async (token, done) => {
    try {
      // Verify this JWT
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, `verified user token`);

      done(null, user.email);
    } catch (err) {
      logger.error({ err, token }, `could not verify token`);
      done(null, false);
    }
  });

module.exports.authenticate = () => passport.authenticate(`bearer`, { session: false });
