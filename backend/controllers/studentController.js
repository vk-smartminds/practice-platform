import Chapter from '../models/chapterModel.js';
import Topic from '../models/topicModel.js';
import Question from '../models/questionModel.js';
import Subject from '../models/subjectModel.js';
import Class from '../models/classModel.js';

// export const getQuestionsForTopic = async (req, res) => {
//     try {
//         // 1. Extract all necessary IDs from the request
//         const { chapterId, topicId } = req.params;
//         const studentClassId = req.user.classId;

//         // 2. Security Check #1: Verify the chapter exists and belongs to the student's class.
//         // This prevents access to content from other classes.
//         const chapter = await Chapter.findById(chapterId);
//         if (!chapter) {
//             return res.status(404).json({ message: 'Chapter not found' });
//         }
//         if (chapter.classId.toString() !== studentClassId.toString()) {
//             return res.status(403).json({ message: 'Forbidden: You do not have access to this chapter' });
//         }

//         // 3. Security Check #2: Verify the topic exists and belongs to the chapter from the URL.
//         // This prevents a user from mixing and matching IDs in the URL.
//         const topic = await Topic.findById(topicId);
//         if (!topic) {
//             return res.status(404).json({ message: 'Topic not found' });
//         }
//         if (topic.chapterId.toString() !== chapterId) {
//             return res.status(403).json({ message: 'Forbidden: This topic does not belong to the specified chapter' });
//         }

//         // 4. Fetch Data: If all security checks pass, get the questions.
//         const questions = await Question.find({ topicId: topicId });

//         // 5. Send the response
//         res.status(200).json(questions);

//     } catch (error) {
//         // 6. Handle any unexpected server errors
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };




// getStudentClass
export const getStudentClass = async (req, res) => {
    try {
        const classId = req.params.classId;
        // Return the class details
        const studentClass = await Class.findById(classId); 

        if (studentClass) {
            res.status(200).json(studentClass);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// getAllSubjectsForClass
export const getAllSubjectsForClass = async (req, res) => {
    try {
        const classId = req.user.classId;
        // Return all subjects for the class
        const subjects = await Subject.find({ classId: classId });

        if (subjects && subjects.length > 0) {
            res.status(200).json(subjects);
        } else {
            res.status(404).json({ message: 'No subjects found for this class' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// getAllChaptersForSubject
export const getAllChaptersForSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        // Return all chapters for the subject
        const chapters = await Chapter.find({ subjectId: subjectId});

        if (chapters && chapters.length > 0) {
            res.status(200).json(chapters);
        } else {
            res.status(404).json({ message: 'No chapters found for this subject' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// getAllTopicsForChapter
export const getAllTopicsForChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const topics = await Topic.find({ chapterId: chapterId });
        res.status(200).json(topics);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// getAllQuestionsForTopic
export const getAllQuestionsForTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const questions = await Question.find({ topicId: topicId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};