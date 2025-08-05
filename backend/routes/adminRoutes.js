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

    createClass,
    getClassById,
    getSubjectById,
    getChapterById,
    getTopicById,
    updateClass,
    deleteClass
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

// --- CREATE ---
router.route('/classes').post(adminOnly, createClass); // Add this
// ... (rest of create routes)

// --- READ (for populating lists) ---
// ... (existing read routes)

// --- READ SINGLE ITEM (for breadcrumbs) ---
router.route('/classes/:id').get(adminOnly, getClassById);
router.route('/subjects/:id').get(adminOnly, getSubjectById);
router.route('/chapters/:id').get(adminOnly, getChapterById);
router.route('/topics/:id').get(adminOnly, getTopicById);

// --- UPDATE (PUT requests) ---
router.route('/classes/:id').put(adminOnly, updateClass); // Add this
// ... (rest of update routes)

// --- DELETE ---
router.route('/classes/:id').delete(adminOnly, deleteClass); // Add this
// ... (rest of delete routes)


export default router;