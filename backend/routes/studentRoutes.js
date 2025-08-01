import express from 'express';
import { getAllSubjectsForClass, getAllChaptersForSubject, getAllTopicsForChapter, getAllQuestionsForTopic, getStudentClass } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
// import { get } from 'mongoose';

const router = express.Router();

// This route is protected, requires login, and is restricted to users with the 'student' role.
router.get('/class/:classId', protect, authorize('student'), getStudentClass);
router.get('/subjects', protect, authorize('student'), getAllSubjectsForClass);
router.get('/chapters/:subjectId', protect, authorize('student'), getAllChaptersForSubject);
router.get('/topics/:chapterId', protect, authorize('student'), getAllTopicsForChapter);
router.get('/questions/:topicId', protect, authorize('student'), getAllQuestionsForTopic);

export default router;  