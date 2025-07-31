import Chapter from '../models/chapterModel.js';

// @desc    Create a new chapter
// @route   POST /api/admin/chapters
// @access  Private (Admin)
export const createChapter = async (req, res) => {
    const { title, chapterNumber, classId, subjectId } = req.body;

    // Basic validation
    if (!title || !classId || !subjectId || !chapterNumber) {
        return res.status(400).json({ message: 'Please provide title, classId, chapter Number and subjectId' });
    }

    const chapter = await Chapter.create({
        title,
        chapterNumber,
        classId,
        subjectId
    });

    res.status(201).json(chapter);
};
