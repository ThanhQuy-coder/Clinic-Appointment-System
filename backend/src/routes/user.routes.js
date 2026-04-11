const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const { authenticate } = require('../middlewares/auth.middleware.js');
const { authorize } = require('../middlewares/role.middleware.js');
const {
    registerRules,
    loginRules,
    updateProfileRules,
    changePasswordRules,
    userIdRule,
    validate,
} = require('../validators/user.validator.js');

/**
 * Public Routes (No authentication required)
 */

// POST /api/users/register - Register a new user
router.post('/register', registerRules, validate, userController.register);

// POST /api/users/login - Login user
router.post('/login', loginRules, validate, userController.login);

/**
 * Protected Routes (Authentication required)
 */

// GET /api/users/profile - Get current user profile
router.get('/profile', authenticate, userController.getProfile);

// PUT /api/users/profile - Update current user profile
router.put('/profile', authenticate, updateProfileRules, validate, userController.updateProfile);

// PUT /api/users/change-password - Change password
router.put('/change-password', authenticate, changePasswordRules, validate, userController.changePassword);

/**
 * Admin Only Routes
 */

// GET /api/users - Get all users (Admin only)
router.get('/', authenticate, authorize('Admin'), userController.getAllUsers);

// GET /api/users/:id - Get user by ID (Admin only)
router.get('/:id', authenticate, authorize('Admin'), userIdRule, validate, userController.getUserById);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put('/:id/role', authenticate, authorize('Admin'), userIdRule, validate, userController.updateUserRole);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), userIdRule, validate, userController.deleteUser);

module.exports = router;
