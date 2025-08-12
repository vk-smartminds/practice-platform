import Student from '../models/studentModel.js';
import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  // Destructure all fields from the request body
  const { 
    name, 
    email, 
    password, 
    classId, 
    school, 
    address, 
    guardianName, 
    guardianMobileNumber 
  } = req.body;

  // Basic validation for the address object
  if (!address || !address.city || !address.state || !address.pincode) {
    return res.status(400).json({ message: 'Please provide a complete address.' });
  }

  try {
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'A student with this email already exists' });
    }

    // Create a new student with all the provided details
    const student = await Student.create({
      name,
      email,
      password, // The pre-save hook will hash this
      classId,
      school,
      address,
      guardianName,
      guardianMobileNumber,
    });

    if (student) {
      // Generate a token and send back a success response
      generateToken(res, student._id, 'student');
      res.status(201).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};
// @desc    Login user (student or admin) & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if the user is a student
    let user = await Student.findOne({ email });
    let role = 'student';

    // Step 2: If not a student, check if the user is an admin
    if (!user) {
      user = await Admin.findOne({ email });
      role = 'admin';
    }

    // Step 3: If user exists in either collection and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(res, user._id, role);
      
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        classId: user.classId || null, // Only for students
        token: token,
      });
    } else {
      // Generic error message for security
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getStudentProfile = async (req, res) => {
  // Your authentication middleware should have already found the user 
  // and attached it to `req.user`.
  
  if (req.user) {
    // The user object is already available, so just send it back.
    // There's no need to query the database again.
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      className: req.user.className, // Make sure your middleware populates this
      school: req.user.school,
      address: req.user.address,
      guardianName: req.user.guardianName,
      guardianMobileNumber: req.user.guardianMobileNumber,
      // Add any other fields you need on the profile page
    });
  } else {
    // This case handles if the middleware fails for some reason.
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private (Student only)
export const updateStudentProfile = async (req, res) => {
  // The user's ID is available from the 'protect' middleware via req.user._id
  const student = await Student.findById(req.user._id);

  if (student) {
    // Update only the fields that are allowed to be changed
    student.name = req.body.name || student.name;
    student.school = req.body.school || student.school; // <<< FIX IS HERE
    student.guardianName = req.body.guardianName || student.guardianName;
    
    // Safely update the nested address object
    if (req.body.address) {
        student.address.city = req.body.address.city || student.address.city;
        student.address.state = req.body.address.state || student.address.state;
        student.address.pincode = req.body.address.pincode || student.address.pincode;
    }

    const updatedStudent = await student.save();

    // Send back the updated profile information
    res.status(200).json({
      _id: updatedStudent._id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      className: req.user.className, // className comes from the populated middleware
      school: updatedStudent.school,
      address: updatedStudent.address,
      guardianName: updatedStudent.guardianName,
      guardianMobileNumber: updatedStudent.guardianMobileNumber,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Helper function to generate JWT and set it in a cookie
const generateToken = (res, userId, userRole) => {
  const token = jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};