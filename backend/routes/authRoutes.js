import express from 'express';
import { registerUser, loginUser, logoutUser, getStudentProfile, updateStudentProfile } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // Logout is protected implicitly by requiring a session
router.get('/profile', protect, authorize('student'), getStudentProfile); // Get user profile, protected route
router.put('/profile', protect, authorize('student'), updateStudentProfile); // Update user profile, protected route

export default router;