import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // Decode token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support for both `id` or `_id` field in token
    const userId = decoded.id || decoded._id;

    // Find user by ID and attach to request
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Middleware to check admin role
export const authorize = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admins only'
    });
  }
  next();
};
