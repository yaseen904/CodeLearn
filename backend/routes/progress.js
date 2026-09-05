import express from 'express';
import Submission from '../models/Submission.js';
import QuizAttempt from '../models/QuizAttempt.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.userId })
      .populate('problemId', 'title topic difficulty');

    const quizAttempts = await QuizAttempt.find({ userId: req.user.userId });

    const topicPerformance = {};
    const difficultyPerformance = { Easy: 0, Medium: 0, Hard: 0 };

    submissions.forEach(sub => {
      const topic = sub.problemId?.topic || 'Other';
      const difficulty = sub.problemId?.difficulty || 'Medium';

      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { solved: 0, attempted: 0 };
      }
      topicPerformance[topic].attempted++;
      if (sub.status === 'Accepted') {
        topicPerformance[topic].solved++;
      }

      if (difficultyPerformance[difficulty] !== undefined) {
        difficultyPerformance[difficulty]++;
      }
    });

    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const daySubmissions = await Submission.countDocuments({
        userId: req.user.userId,
        submittedAt: { $gte: dayStart, $lte: dayEnd }
      });

      weeklyActivity.push({
        date: dayStart.toISOString().split('T')[0],
        submissions: daySubmissions
      });
    }

    res.json({
      totalProblemsSolved: submissions.filter(s => s.status === 'Accepted').length,
      totalSubmissions: submissions.length,
      totalQuizzes: quizAttempts.length,
      topicPerformance,
      difficultyPerformance,
      weeklyActivity,
      recentSubmissions: submissions.slice(-10).reverse(),
      recentQuizzes: quizAttempts.slice(-10).reverse()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
