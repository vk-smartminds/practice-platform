import express from 'express';
import { createChapter } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is protected, requires login, and is restricted to users with the 'admin' role.
router.post('/chapters', protect, authorize('admin'), createChapter);

// ... Add other admin routes for topics, questions etc. here

export default router;