import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  // --- NEW FIELDS ---
  school: {
    type: String,
    required: true,
  },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  guardianName: {
    type: String,
    required: true,
  },
  guardianMobileNumber: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Middleware to hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Student = mongoose.model('Student', studentSchema);
export default Student;