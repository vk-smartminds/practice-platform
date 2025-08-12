import Subject from "../models/subjectModel.js";
import Chapter from "../models/chapterModel.js";
import Topic from "../models/topicModel.js";
import Question from "../models/questionModel.js";
import Class from "../models/classModel.js";
import asyncHandler from "express-async-handler";
import Student from "../models/studentModel.js";

// --- CREATE routes ---
// (Your existing create functions: createSubject, createChapter, etc. remain here)
export const createSubject = asyncHandler(async (req, res) => {
    const { name, classId } = req.body;
    if (!name || !classId) {
        res.status(400);
        throw new Error("Please provide a subject name and classId");
    }
    const subject = await Subject.create({ name, classId });
    res.status(201).json(subject);
});

export const createChapter = asyncHandler(async (req, res) => {
    const { chapterName, chapterNumber, subjectId } = req.body;
    if (!chapterName || !chapterNumber || !subjectId) {
        res.status(400);
        throw new Error("Please provide chapterName, chapterNumber, and subjectId");
    }
    const chapter = await Chapter.create({ chapterName, chapterNumber, subjectId });
    res.status(201).json(chapter);
});

export const createTopic = asyncHandler(async (req, res) => {
    const { title, topicNumber, chapterId } = req.body;
    if (!title || !topicNumber || !chapterId) {
        res.status(400);
        throw new Error("Please provide title, topicNumber, and chapterId");
    }
    const topic = await Topic.create({ title, topicNumber, chapterId });
    res.status(201).json(topic);
});

export const createQuestion = asyncHandler(async (req, res) => {
    const { questionText, answerText, explanation, topicId } = req.body;
    if (!questionText || !answerText || !topicId) {
        res.status(400);
        throw new Error("Please provide questionText, answerText, and topicId");
    }
    const question = await Question.create({ questionText, answerText, explanation, topicId });
    res.status(201).json(question);
});


// --- GET routes for populating dropdowns ---
// (Your existing GET functions remain here)
export const getClasses = asyncHandler(async (req, res) => {
    const classes = await Class.find({});
    res.status(200).json(classes);
});

export const getSubjectsByClass = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({ classId: req.params.classId });
    res.status(200).json(subjects);
});

export const getChaptersBySubject = asyncHandler(async (req, res) => {
    const chapters = await Chapter.find({ subjectId: req.params.subjectId });
    res.status(200).json(chapters);
});

export const getTopicsByChapter = asyncHandler(async (req, res) => {
    const topics = await Topic.find({ chapterId: req.params.chapterId });
    res.status(200).json(topics);
});

// NEW: Get all questions for a specific topic
export const getQuestionsByTopic = asyncHandler(async (req, res) => {
    const questions = await Question.find({ topicId: req.params.topicId });
    res.status(200).json(questions);
});


// --- UPDATE routes for editing content ---

const updateResource = async (model, id, body, res) => {
    const resource = await model.findById(id);
    if (!resource) {
        res.status(404);
        throw new Error("Resource not found");
    }
    Object.assign(resource, body);
    await resource.save();
    res.status(200).json(resource);
};

export const updateSubject = asyncHandler(async (req, res) => updateResource(Subject, req.params.id, req.body, res));
export const updateChapter = asyncHandler(async (req, res) => updateResource(Chapter, req.params.id, req.body, res));
export const updateTopic = asyncHandler(async (req, res) => updateResource(Topic, req.params.id, req.body, res));
export const updateQuestion = asyncHandler(async (req, res) => updateResource(Question, req.params.id, req.body, res));


// --- DELETE routes for removing content ---

export const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
        res.status(404);
        throw new Error("Subject not found");
    }
    // TODO: Implement cascading delete for chapters, topics, and questions related to this subject if needed
    await subject.deleteOne();
    res.status(200).json({ message: "Subject deleted" });
});

export const deleteChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
        res.status(404);
        throw new Error("Chapter not found");
    }
    // Cascade delete: remove all topics and questions within this chapter
    const topics = await Topic.find({ chapterId: chapter._id });
    for (const topic of topics) {
        await Question.deleteMany({ topicId: topic._id });
    }
    await Topic.deleteMany({ chapterId: chapter._id });
    await chapter.deleteOne();
    res.status(200).json({ message: "Chapter and all its content deleted" });
});

export const deleteTopic = asyncHandler(async (req, res) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
        res.status(404);
        throw new Error("Topic not found");
    }
    // Cascade delete: remove all questions within this topic
    await Question.deleteMany({ topicId: topic._id });
    await topic.deleteOne();
    res.status(200).json({ message: "Topic and all its questions deleted" });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        res.status(404);
        throw new Error("Question not found");
    }
    await question.deleteOne();
    res.status(200).json({ message: "Question deleted" });
});

// --- GET SINGLE ITEM routes for breadcrumbs ---

const getResourceById = async (model, id, res) => {
    const resource = await model.findById(id);
    if (!resource) {
        res.status(404);
        throw new Error("Resource not found");
    }
    res.status(200).json(resource);
};

export const getClassById = asyncHandler(async (req, res) => getResourceById(Class, req.params.id, res));
export const getSubjectById = asyncHandler(async (req, res) => getResourceById(Subject, req.params.id, res));
export const getChapterById = asyncHandler(async (req, res) => getResourceById(Chapter, req.params.id, res));
export const getTopicById = asyncHandler(async (req, res) => getResourceById(Topic, req.params.id, res));


// --- Also, add a simple CREATE route for Classes ---
export const createClass = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("Please provide a class name");
    }
    const newClass = await Class.create({ name });
    res.status(201).json(newClass);
});

// --- And UPDATE/DELETE for Classes ---
export const updateClass = asyncHandler(async (req, res) => updateResource(Class, req.params.id, req.body, res));
export const deleteClass = asyncHandler(async (req, res) => {
     const classToDelete = await Class.findById(req.params.id);
    if (!classToDelete) {
        res.status(404);
        throw new Error("Class not found");
    }
    // Add cascading delete logic if necessary
    await classToDelete.deleteOne();
    res.status(200).json({ message: "Class deleted" });
});

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin only)
export const getAllStudents = async (req, res) => {
  try {
    // Fetch all students and populate their class name
    const students = await Student.find({}).populate('classId', 'name');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching students.' });
  }
};

// @desc    Get a single student by ID
// @route   GET /api/admin/students/:id
// @access  Private (Admin only)
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'name');
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching student data.' });
  }
};

// @desc    Update a student's profile
// @route   PUT /api/admin/students/:id
// @access  Private (Admin only)
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      // Update fields from the request body
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      student.school = req.body.school || student.school;
      student.guardianName = req.body.guardianName || student.guardianName;
      student.guardianMobileNumber = req.body.guardianMobileNumber || student.guardianMobileNumber;
      
      if (req.body.address) {
        student.address = { ...student.address, ...req.body.address };
      }
      if (req.body.classId) {
        student.classId = req.body.classId;
      }
      // Note: For security, password changes should have a separate, dedicated route.

      const updatedStudent = await student.save();
      res.status(200).json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating student.' });
  }
};

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin only)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne(); // Mongoose 5+ uses deleteOne()
      res.status(200).json({ message: 'Student removed successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting student.' });
  }
};