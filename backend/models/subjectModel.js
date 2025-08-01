import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // e.g., "Mathematics", "Physics"
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // Reference to the Class model
    required: true, // Ensure every subject is associated with a class
  }
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;