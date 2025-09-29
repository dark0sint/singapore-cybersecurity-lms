const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: String,
  content: String,
  quiz: [{
    question: String,
    options: [String],
    answer: Number
  }]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  modules: [moduleSchema]
});

module.exports = mongoose.model('Course', courseSchema);
