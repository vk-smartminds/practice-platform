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

// @desc    Update a student's profile by Admin
// @route   PUT /api/admin/students/:id
// @access  Private (Admin only)
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      // Only update fields that are allowed to be changed by an admin
      student.name = req.body.name || student.name;
      student.guardianName = req.body.guardianName || student.guardianName;
      student.guardianMobileNumber = req.body.guardianMobileNumber || student.guardianMobileNumber;
      
      // Only update class if a new classId is provided
      if (req.body.classId) {
        student.classId = req.body.classId;
      }
      
      if (req.body.address) {
        student.address = { ...student.address, ...req.body.address };
      }
      
      // Email and School are explicitly NOT updated
      
      const updatedStudent = await student.save();
      // Populate the class name for the response
      const populatedStudent = await Student.findById(updatedStudent._id).populate('classId', 'name');

      res.status(200).json(populatedStudent);
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

// @desc    Get student enrollment statistics by pincode
// @route   GET /api/admin/students/stats?timeframe=week
// @access  Private (Admin only)
export const getEnrollmentStats = async (req, res) => {
    const { timeframe } = req.query;
    let startDate;
    const now = new Date();

    switch (timeframe) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case '6months':
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            // If no timeframe or an invalid one is provided, default to all time
            startDate = new Date(0); // The beginning of time (epoch)
    }

    try {
        const stats = await Student.aggregate([
            {
                // Step 1: Filter students created within the selected timeframe
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                // Step 2: Group the filtered students by their address.pincode
                $group: {
                    _id: '$address.pincode', // Group by pincode
                    count: { $sum: 1 }      // Count the number of students in each group
                }
            },
            {
                // Step 3: Sort the results by count in descending order
                $sort: {
                    count: -1
                }
            },
            {
                // Step 4: Rename the '_id' field to 'pincode' for a cleaner output
                $project: {
                    _id: 0,
                    pincode: '$_id',
                    count: 1
                }
            }
        ]);

        res.status(200).json(stats);

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: 'Server error while fetching enrollment stats.' });
    }
};

// @desc    Get detailed student list by pincode and timeframe
// @route   GET /api/admin/students/stats/pincode?pincode=110056&timeframe=month
// @access  Private (Admin only)
export const getStudentDetailsByPincode = async (req, res) => {
    const { timeframe, pincode } = req.query;

    if (!pincode) {
        return res.status(400).json({ message: 'Pincode is required.' });
    }

    let startDate;
    const now = new Date();

    switch (timeframe) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case '6months':
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            startDate = new Date(0); // Default to all time
    }

    try {
        const students = await Student.find({
            'address.pincode': pincode,
            createdAt: { $gte: startDate }
        }).select('name email school'); // Select only the required fields

        res.status(200).json({
            count: students.length,
            students: students
        });

    } catch (error) {
        console.error("Pincode Stats Error:", error);
        res.status(500).json({ message: 'Server error while fetching student details by pincode.' });
    }
};