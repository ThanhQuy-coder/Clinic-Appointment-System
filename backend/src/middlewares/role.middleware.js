const { forbiddenResponse } = require('../utils/response.js');

/**
 * Role-based authorization middleware
 * @param  {...string} allowedRoles - Roles allowed to access the route
 * @returns {Function} Middleware function
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return forbiddenResponse(res, 'User not authenticated');
        }
        
        if (!allowedRoles.includes(req.user.Role)) {
            return forbiddenResponse(res, `Access denied. Required role: ${allowedRoles.join(' or ')}`);
        }
        
        next();
    };
};

module.exports = {
    authorize,
};
