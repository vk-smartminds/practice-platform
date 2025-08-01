import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  chapterName: {
    type: String,
    required: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
}, {
  timestamps: true,
});

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;