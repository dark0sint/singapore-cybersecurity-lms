const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/quizzes', require('./routes/quizzes'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Seed initial courses (run once)
const seedCourses = async () => {
  const Course = require('./models/Course');
  const existing = await Course.countDocuments();
  if (existing === 0) {
    await Course.insertMany([
      {
        title: "Introduction to Singapore's Cybersecurity Act 2018",
        description: "Overview of Singapore's key cybersecurity legislation.",
        modules: [
          { title: "Chapter 1: Critical Information Infrastructure", content: "Details on CII sectors like energy and banking.", quiz: [{ question: "What is CII?", options: ["Critical Info Infra", "Common Info Infra"], answer: 0 }] }
        ]
      },
      {
        title: "PDPA: Personal Data Protection Act",
        description: "Singapore's data privacy law and compliance.",
        modules: [
          { title: "Chapter 1: Consent and Data Collection", content: "How to obtain consent under PDPA.", quiz: [{ question: "What does PDPA stand for?", options: ["Personal Data Protection Act", "Public Data Privacy Act"], answer: 0 }] }
        ]
      }
    ]);
    console.log('Courses seeded');
  }
};
seedCourses();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
