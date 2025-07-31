import jwt from 'jsonwebtoken';
import Student from '../models/studentModel.js';
import Admin from '../models/adminModel.js';

/**
 * Middleware to protect routes by verifying the JWT from cookies.
 * It uses the 'role' stored in the token to look up the user in the correct collection (Students or Admins).
 */
export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify the token to get the payload { id, role }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    // Conditionally find the user based on the role in the token
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach the user object (with role) to the request for subsequent middleware/controllers
    req.user = user;
    req.user.role = decoded.role; // Ensure the role is explicitly set

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Middleware for Role-Based Access Control (RBAC).
 * This should be used *after* the 'protect' middleware.
 * @param {...string} roles - A list of roles allowed to access the route (e.g., 'admin', 'student').
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is attached by the 'protect' middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: User role '${req.user.role}' is not authorized for this resource` 
      });
    }
    next();
  };
};