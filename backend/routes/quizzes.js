const express = require('express');
const QuizResult = require('../models/QuizResult');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');
const router = express.Router();

// Submit quiz
router.post('/submit', auth, async (req, res) => {
  const { enrollmentId, moduleIndex, answers } = req.body;
  try {
    const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId: req.user.id });
    if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });

    // Get course to fetch quiz questions
    const course = await require('../models/Course').findById(enrollment.courseId);
    const quiz = course.modules[moduleIndex].quiz;

    // Calculate score
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === quiz[i].answer) score++;
    });
    const total = quiz.length;
    const percentage = Math.round((score / total) * 100);

    const result = new QuizResult({
      userId: req.user.id,
      enrollmentId,
      moduleIndex,
      score: percentage,
      answers
    });
    await result.save();

    res.json({ score: percentage, total });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get quiz results for enrollment
router.get('/:enrollmentId', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ enrollmentId: req.params.enrollmentId, userId: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
