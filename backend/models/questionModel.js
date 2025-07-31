import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  answerText: {
    type: String,
    required: false, // Making this optional provides more flexibility
    trim: true,
  },
  // Index of the correct answer in the options array
  questionType: {
    type: String,
    enum: ['Short Answer', 'Long Answer', 'Problem-Solving', 'Definition', 'Fill-in-the-Blank'],
    default: 'Short Answer',
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
}, {
  timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);
export default Question;