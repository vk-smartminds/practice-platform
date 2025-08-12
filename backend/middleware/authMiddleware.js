// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import Student from '../models/studentModel.js';
import Admin from '../models/adminModel.js';

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === 'student') {
      // FIX: Added .populate() to fetch the related Class document
      // The first argument is the path to populate ('classId').
      // The second argument specifies which fields to include from the Class document ('name').
      user = await Student.findById(decoded.id)
        .populate('classId', 'name')
        .select('-password');
        
    } else if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    // Now, req.user will contain the populated class details.
    // To make it consistent with your frontend, we can create a virtual 'className' field.
    const userObject = user.toObject();
    if (userObject.classId && userObject.classId.name) {
        userObject.className = userObject.classId.name;
    }

    req.user = userObject;
    req.user.role = decoded.role;

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// The 'authorize' middleware does not need any changes.
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: User role '${req.user.role}' is not authorized for this resource` 
      });
    }
    next();
  };
};