const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'apna-shelter-jwt-secret';

/**
 * Middleware to authenticate JWT token
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Development mode bypass - ONLY FOR DEVELOPMENT/TESTING
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Authentication bypass enabled');
      
      // Create a mock admin user for development purposes
      req.user = {
        _id: '000000000000000000000000',
        username: 'dev-admin',
        email: 'dev@example.com',
        role: 'admin',
        isActive: true
      };
      
      return next();
    }
    
    // Get token from header
    let token = req.header('Authorization');
    
    console.log('Auth header received:', token);
    
    // Check if token exists and has the correct format
    if (!token) {
      console.log('No token provided in Authorization header');
      
      // For development purposes, allow bypass authentication with a special header
      if (process.env.NODE_ENV === 'development' && req.header('X-Dev-Auth') === 'true') {
        console.log('Development authentication bypass activated');
        req.user = {
          _id: '000000000000000000000000',
          username: 'dev-admin',
          email: 'dev@example.com',
          role: 'admin',
          isActive: true
        };
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    
    // Remove Bearer prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
      console.log('Token after removing Bearer prefix:', token.substring(0, 20) + '...');
    }
    
    if (!token) {
      console.log('Token is empty after removing Bearer prefix');
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }
    
    try {
      // Verify token
      console.log('Attempting to verify token...');
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token verified successfully, decoded user ID:', decoded.id);
      
      // Find user by id
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }
      
      // Add user to request object
      req.user = user;
      
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      
      // For development purposes, allow bypass authentication with a special header
      if (process.env.NODE_ENV === 'development' && req.header('X-Dev-Auth') === 'true') {
        console.log('Development authentication bypass activated');
        req.user = {
          _id: '000000000000000000000000',
          username: 'dev-admin',
          email: 'dev@example.com',
          role: 'admin',
          isActive: true
        };
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
exports.isAdmin = (req, res, next) => {
  try {
    // Development mode bypass - ONLY FOR DEVELOPMENT/TESTING
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Admin check bypass enabled');
      return next();
    }
    
    // Check if user exists and has admin role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Middleware to check if user has manager role or higher
 */
exports.isManager = (req, res, next) => {
  try {
    // Development mode bypass - ONLY FOR DEVELOPMENT/TESTING
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Manager check bypass enabled');
      return next();
    }
    
    // Check if user exists and has manager or admin role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Manager or admin role required.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Manager check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
