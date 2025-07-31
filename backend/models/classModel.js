import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // e.g., "10", "12"
  },
});

const Class = mongoose.model('Class', classSchema);
export default Class;