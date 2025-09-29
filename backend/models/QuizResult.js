const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  moduleIndex: { type: Number, required: true },
  score: { type: Number, required: true }, // 0-100
  answers: [Number] // User's selected options
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
