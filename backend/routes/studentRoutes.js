import express from 'express';
import { getAllChaptersForStudent, getChapterForStudent, getAllTopicsForChapter, getQuestionsForTopic } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
// import { get } from 'mongoose';

const router = express.Router();

// This route is protected, requires login, and is restricted to users with the 'student' role.
router.get('/chapters/:chapterId/topics/:topicId/questions', protect, authorize('student'), getQuestionsForTopic);
router.get('/chapters/:chapterId/topics', protect, authorize('student'), getAllTopicsForChapter);
router.get('/chapters/', protect, authorize('student'), getAllChaptersForStudent);
router.get('/chapters/:id', protect, authorize('student'), getChapterForStudent);

export default router;