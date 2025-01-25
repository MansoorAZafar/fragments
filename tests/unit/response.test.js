/// <summary>
/// This module is a test file for ../../src/response.js
/// </summary>

const { createErrorResponse, createSuccessResponse } = require('../../src/response');

// Defining the set of unit tests
describe('API Responses', () => {
  test('createErrorResponse()', () => {
    // Create the actual response
    const errorResponse = createErrorResponse(404, 'not found');
    //Expectation
    expect(errorResponse).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'not found',
      },
    });
  });

  test('createSuccessResponse()_no_arg', () => {
    // No arg passed
    const successResponse = createSuccessResponse();
    expect(successResponse).toEqual({
      status: 'ok',
    });
  });

  test('createSuccessResponse(data)_with_arg', () => {
    //Arg passed
    const data = { a: 1, b: 2 };
    const successResponse = createSuccessResponse(data);

    expect(successResponse).toEqual({
      status: 'ok',
      a: 1,
      b: 2,
    });
  });
});
