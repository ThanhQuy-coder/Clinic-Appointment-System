const { body, param, validationResult } = require('express-validator');
const { badRequestResponse } = require('../utils/response.js');

/**
 * Validation rules for user registration
 */
const registerRules = [
    body('FullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ max: 100 }).withMessage('Full name must be at most 100 characters'),
    body('Phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
        .isNumeric().withMessage('Phone number must contain only digits'),
    body('Email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 50 }).withMessage('Email must be at most 50 characters')
        .normalizeEmail(),
    body('Password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('Role')
        .optional()
        .isIn(['Admin', 'Patient', 'Doctor']).withMessage('Role must be Admin, Patient, or Doctor'),
];

/**
 * Validation rules for user login
 */
const loginRules = [
    body('Email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('Password')
        .notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for updating profile
 */
const updateProfileRules = [
    body('FullName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Full name must be between 1 and 100 characters'),
    body('Phone')
        .optional()
        .trim()
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
        .isNumeric().withMessage('Phone number must contain only digits'),
    body('Email')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 50 }).withMessage('Email must be at most 50 characters')
        .normalizeEmail(),
];

/**
 * Validation rules for changing password
 */
const changePasswordRules = [
    body('CurrentPassword')
        .notEmpty().withMessage('Current password is required'),
    body('NewPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('ConfirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.NewPassword) {
                throw new Error('Confirm password does not match new password');
            }
            return true;
        }),
];

/**
 * Validation rules for user ID parameter
 */
const userIdRule = [
    param('id')
        .isUUID().withMessage('Invalid user ID format'),
];

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg,
        }));
        return badRequestResponse(res, 'Validation failed', formattedErrors);
    }
    
    next();
};

module.exports = {
    registerRules,
    loginRules,
    updateProfileRules,
    changePasswordRules,
    userIdRule,
    validate,
};
