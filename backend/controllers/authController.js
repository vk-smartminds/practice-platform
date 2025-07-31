import Student from '../models/studentModel.js';
import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, classId, subjectId } = req.body;

  try {
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'A student with this email already exists' });
    }

    // Note: We don't hash the password here because the pre-save hook in the model handles it.
    const student = await Student.create({
      name,
      email,
      password, // Pass the plain password, the model will hash it
      classId,
      subjectId,
    });

    if (student) {
      // Generate token and set cookie after successful registration
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