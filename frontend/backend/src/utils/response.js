/**
 * Standard API response format
 */

const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message,
    };
    
    if (errors) {
        response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
};

const createdResponse = (res, data = null, message = 'Created successfully') => {
    return successResponse(res, data, message, 201);
};

const notFoundResponse = (res, message = 'Resource not found') => {
    return errorResponse(res, message, 404);
};

const unauthorizedResponse = (res, message = 'Unauthorized') => {
    return errorResponse(res, message, 401);
};

const forbiddenResponse = (res, message = 'Forbidden') => {
    return errorResponse(res, message, 403);
};

const badRequestResponse = (res, message = 'Bad Request', errors = null) => {
    return errorResponse(res, message, 400, errors);
};

const conflictResponse = (res, message = 'Conflict') => {
    return errorResponse(res, message, 409);
};

module.exports = {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    badRequestResponse,
    conflictResponse,
};
