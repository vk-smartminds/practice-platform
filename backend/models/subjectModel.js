import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // Reference to the Class model
    required: true, // Ensure every subject is associated with a class
  }
});

// ADD this compound index
// This ensures the combination of name and classId is unique
subjectSchema.index({ name: 1, classId: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;