/// <summary>
/// This module defines the the format for all HTTP responses
/// </summary>
/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */
const createSuccessResponse = (data) => {
  return {
    status: 'ok',
    ...data,
  };
};

/**
 * An error response looks like:
 *
 * {
 *   "status": "error",
 *   "error": {
 *     "code": 400,
 *     "message": "invalid request, missing ...",
 *   }
 * }
 */
const createErrorResponse = (code, message) => {
  return {
    status: 'error',
    error: {
      code,
      message,
    },
  };
};

// Export the functions
module.exports = { createSuccessResponse, createErrorResponse };
