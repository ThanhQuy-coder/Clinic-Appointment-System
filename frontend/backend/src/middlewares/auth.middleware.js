const { verifyToken } = require('../services/jwt.service.js');
const { unauthorizedResponse, errorResponse } = require('../utils/response.js');
const { User } = require('../models/index.js');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return unauthorizedResponse(res, 'No token provided');
        }
        
        // Check Bearer token format
        if (!authHeader.startsWith('Bearer ')) {
            return unauthorizedResponse(res, 'Invalid token format. Use: Bearer <token>');
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return unauthorizedResponse(res, 'No token provided');
        }
        
        // Verify token
        const decoded = verifyToken(token);
        
        // Get user from database
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            return unauthorizedResponse(res, 'User not found');
        }
        
        // Attach user to request
        req.user = user;
        req.userId = user.Id;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return unauthorizedResponse(res, 'Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            return unauthorizedResponse(res, 'Invalid token');
        }
        return errorResponse(res, 'Authentication failed', 401);
    }
};

module.exports = {
    authenticate,
};
