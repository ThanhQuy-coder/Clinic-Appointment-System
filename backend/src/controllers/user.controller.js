const { User } = require('../models/index.js');
const { hashPassword, comparePassword } = require('../utils/password.js');
const { generateToken } = require('../services/jwt.service.js');
const {
    successResponse,
    createdResponse,
    notFoundResponse,
    unauthorizedResponse,
    badRequestResponse,
    conflictResponse,
} = require('../utils/response.js');

/**
 * Register a new user
 * POST /api/users/register
 */
const register = async (req, res) => {
    const { FullName, Phone, Email, Password, Role = 'Patient' } = req.body;
    
    // Check if email already exists
    const existingEmail = await User.findOne({ where: { Email } });
    if (existingEmail) {
        return conflictResponse(res, 'Email already registered');
    }
    
    // Check if phone already exists
    const existingPhone = await User.findOne({ where: { Phone } });
    if (existingPhone) {
        return conflictResponse(res, 'Phone number already registered');
    }
    
    // Hash password
    const PasswordHash = await hashPassword(Password);
    
    // Create user
    const user = await User.create({
        FullName,
        Phone,
        Email,
        PasswordHash,
        Role,
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data without password
    const userData = {
        Id: user.Id,
        FullName: user.FullName,
        Phone: user.Phone,
        Email: user.Email,
        Role: user.Role,
        CreatedAt: user.CreatedAt,
    };
    
    return createdResponse(res, { user: userData, token }, 'Registration successful');
};

/**
 * Login user
 * POST /api/users/login
 */
const login = async (req, res) => {
    const { Email, Password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { Email } });
    
    if (!user) {
        return unauthorizedResponse(res, 'Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(Password, user.PasswordHash);
    
    if (!isPasswordValid) {
        return unauthorizedResponse(res, 'Invalid email or password');
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data without password
    const userData = {
        Id: user.Id,
        FullName: user.FullName,
        Phone: user.Phone,
        Email: user.Email,
        Role: user.Role,
        CreatedAt: user.CreatedAt,
    };
    
    return successResponse(res, { user: userData, token }, 'Login successful');
};

/**
 * Get current user profile
 * GET /api/users/profile
 */
const getProfile = async (req, res) => {
    const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['PasswordHash'] },
    });
    
    if (!user) {
        return notFoundResponse(res, 'User not found');
    }
    
    return successResponse(res, user, 'Profile retrieved successfully');
};

/**
 * Update current user profile
 * PUT /api/users/profile
 */
const updateProfile = async (req, res) => {
    const { FullName, Phone, Email } = req.body;
    const userId = req.userId;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
        return notFoundResponse(res, 'User not found');
    }
    
    // Check if new email is already taken by another user
    if (Email && Email !== user.Email) {
        const existingEmail = await User.findOne({ 
            where: { Email, Id: { [require('sequelize').Op.ne]: userId } } 
        });
        if (existingEmail) {
            return conflictResponse(res, 'Email already registered');
        }
    }
    
    // Check if new phone is already taken by another user
    if (Phone && Phone !== user.Phone) {
        const existingPhone = await User.findOne({ 
            where: { Phone, Id: { [require('sequelize').Op.ne]: userId } } 
        });
        if (existingPhone) {
            return conflictResponse(res, 'Phone number already registered');
        }
    }
    
    // Update fields
    if (FullName) user.FullName = FullName;
    if (Phone) user.Phone = Phone;
    if (Email) user.Email = Email;
    
    await user.save();
    
    // Return updated user data without password
    const userData = {
        Id: user.Id,
        FullName: user.FullName,
        Phone: user.Phone,
        Email: user.Email,
        Role: user.Role,
        UpdatedAt: user.UpdatedAt,
    };
    
    return successResponse(res, userData, 'Profile updated successfully');
};

/**
 * Change password
 * PUT /api/users/change-password
 */
const changePassword = async (req, res) => {
    const { CurrentPassword, NewPassword } = req.body;
    const userId = req.userId;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
        return notFoundResponse(res, 'User not found');
    }
    
    // Verify current password
    const isCurrentPasswordValid = await comparePassword(CurrentPassword, user.PasswordHash);
    
    if (!isCurrentPasswordValid) {
        return badRequestResponse(res, 'Current password is incorrect');
    }
    
    // Hash new password
    const PasswordHash = await hashPassword(NewPassword);
    
    // Update password
    user.PasswordHash = PasswordHash;
    await user.save();
    
    return successResponse(res, null, 'Password changed successfully');
};

/**
 * Get all users (Admin only)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
    const { page = 1, limit = 10, Role, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (Role) {
        whereClause.Role = Role;
    }
    if (search) {
        whereClause[require('sequelize').Op.or] = [
            { FullName: { [require('sequelize').Op.like]: `%${search}%` } },
            { Email: { [require('sequelize').Op.like]: `%${search}%` } },
            { Phone: { [require('sequelize').Op.like]: `%${search}%` } },
        ];
    }
    
    const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['PasswordHash'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['CreatedAt', 'DESC']],
    });
    
    return successResponse(res, {
        users,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
        },
    }, 'Users retrieved successfully');
};

/**
 * Get user by ID (Admin only)
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
        attributes: { exclude: ['PasswordHash'] },
    });
    
    if (!user) {
        return notFoundResponse(res, 'User not found');
    }
    
    return successResponse(res, user, 'User retrieved successfully');
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.userId) {
        return badRequestResponse(res, 'You cannot delete your own account');
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
        return notFoundResponse(res, 'User not found');
    }
    
    await user.destroy();
    
    return successResponse(res, null, 'User deleted successfully');
};

/**
 * Update user role (Admin only)
 * PUT /api/users/:id/role
 */
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { Role } = req.body;
    
    if (!['Admin', 'Patient', 'Doctor'].includes(Role)) {
        return badRequestResponse(res, 'Invalid role. Must be Admin, Patient, or Doctor');
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
        return notFoundResponse(res, 'User not found');
    }
    
    user.Role = Role;
    await user.save();
    
    const userData = {
        Id: user.Id,
        FullName: user.FullName,
        Email: user.Email,
        Role: user.Role,
        UpdatedAt: user.UpdatedAt,
    };
    
    return successResponse(res, userData, 'User role updated successfully');
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
};
