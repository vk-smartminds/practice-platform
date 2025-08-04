import express from 'express';
import {
    // Create
    createSubject,
    createChapter,
    createTopic,
    createQuestion,
    // Read (Get)
    getClasses,
    getSubjectsByClass,
    getChaptersBySubject,
    getTopicsByChapter,
    getQuestionsByTopic,
    // Update
    updateSubject,
    updateChapter,
    updateTopic,
    updateQuestion,
    // Delete
    deleteSubject,
    deleteChapter,
    deleteTopic,
    deleteQuestion,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to apply to all admin routes
const adminOnly = [protect, authorize('admin')];

// --- CREATE ---
router.route('/subjects').post(adminOnly, createSubject);
router.route('/chapters').post(adminOnly, createChapter);
router.route('/topics').post(adminOnly, createTopic);
router.route('/questions').post(adminOnly, createQuestion);

// --- READ (for populating edit lists) ---
router.route('/classes').get(adminOnly, getClasses);
router.route('/subjects/class/:classId').get(adminOnly, getSubjectsByClass);
router.route('/chapters/subject/:subjectId').get(adminOnly, getChaptersBySubject);
router.route('/topics/chapter/:chapterId').get(adminOnly, getTopicsByChapter);
router.route('/questions/topic/:topicId').get(adminOnly, getQuestionsByTopic);

// --- UPDATE (PUT requests) ---
router.route('/subjects/:id').put(adminOnly, updateSubject);
router.route('/chapters/:id').put(adminOnly, updateChapter);
router.route('/topics/:id').put(adminOnly, updateTopic);
router.route('/questions/:id').put(adminOnly, updateQuestion);

// --- DELETE ---
router.route('/subjects/:id').delete(adminOnly, deleteSubject);
router.route('/chapters/:id').delete(adminOnly, deleteChapter);
router.route('/topics/:id').delete(adminOnly, deleteTopic);
router.route('/questions/:id').delete(adminOnly, deleteQuestion);

export default router;