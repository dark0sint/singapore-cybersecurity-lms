const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 }, // Percentage
  completedModules: [Number] // Array of module indices
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
