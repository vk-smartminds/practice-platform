import Chapter from '../models/chapterModel.js';
import Topic from '../models/topicModel.js';
import Question from '../models/questionModel.js';

// @desc    Get chapter details and its topics
// @route   GET /api/student/chapters/:id
// @access  Private (Student)
export const getChapterForStudent = async (req, res) => {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
    }

    // RBAC: Check if the chapter belongs to the student's class
    // req.user is available from the 'protect' middleware
    if (chapter.classId.toString() !== req.user.classId.toString()) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this chapter' });
    }

    // If access is granted, fetch associated topics
    const topics = await Topic.find({ chapterId: chapter._id });

    res.status(200).json({ chapter, topics });
};

export const getAllChaptersForStudent = async (req, res) => {
    try {
        const chapters = await Chapter.find({ classId: req.user.classId });

        if (!chapters || chapters.length === 0) {
            return res.status(404).json({ message: 'No chapters found for this class' });
        }

        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllTopicsForChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const studentClassId = req.user.classId;

        // First, find the chapter to ensure it exists
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        
        // Security Check: Ensure the chapter belongs to the student's class
        if (chapter.classId.toString() !== studentClassId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this chapter' });
        }

        // If authorized, fetch all topics for that chapter
        const topics = await Topic.find({ chapterId: chapterId });
        

        res.status(200).json(topics);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
        
export const getQuestionsForTopic = async (req, res) => {
    try {
        // 1. Extract all necessary IDs from the request
        const { chapterId, topicId } = req.params;
        const studentClassId = req.user.classId;

        // 2. Security Check #1: Verify the chapter exists and belongs to the student's class.
        // This prevents access to content from other classes.
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        if (chapter.classId.toString() !== studentClassId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this chapter' });
        }

        // 3. Security Check #2: Verify the topic exists and belongs to the chapter from the URL.
        // This prevents a user from mixing and matching IDs in the URL.
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        if (topic.chapterId.toString() !== chapterId) {
            return res.status(403).json({ message: 'Forbidden: This topic does not belong to the specified chapter' });
        }

        // 4. Fetch Data: If all security checks pass, get the questions.
        const questions = await Question.find({ topicId: topicId });

        // 5. Send the response
        res.status(200).json(questions);

    } catch (error) {
        // 6. Handle any unexpected server errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
