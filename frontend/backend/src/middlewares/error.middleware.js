const { errorResponse } = require('../utils/response.js');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message,
        }));
        return errorResponse(res, 'Validation error', 400, errors);
    }
    
    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'field';
        return errorResponse(res, `${field} already exists`, 409);
    }
    
    // Sequelize foreign key error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return errorResponse(res, 'Invalid reference to related resource', 400);
    }
    
    // Custom application error
    if (err.statusCode) {
        return errorResponse(res, err.message, err.statusCode);
    }
    
    // Default server error
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message;
    
    return errorResponse(res, message, 500);
};

/**
 * Not found handler middleware
 */
const notFoundHandler = (req, res) => {
    return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
    errorHandler,
    notFoundHandler,
};
