const express = require('express');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');
const router = express.Router();

// Enroll in course
router.post('/', auth, async (req, res) => {
  const { courseId } = req.body;
  try {
    let enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });
    if (enrollment) return res.status(400).json({ msg: 'Already enrolled' });

    enrollment = new Enrollment({ userId: req.user.id, courseId });
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's enrollments with progress
router.get('/', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate('courseId', 'title description');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: req.params.id, userId: req.user.id });
    if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });

    enrollment.progress = req.body.progress || enrollment.progress;
    enrollment.completedModules = req.body.completedModules || enrollment.completedModules;
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
