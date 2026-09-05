import express from 'express';
import Submission from '../models/Submission.js';
import QuizAttempt from '../models/QuizAttempt.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const problemsSolved = await Submission.countDocuments({
      userId: req.user.userId,
      status: 'Accepted'
    });

    const totalSubmissions = await Submission.countDocuments({
      userId: req.user.userId
    });

    const codingAccuracy = totalSubmissions > 0
      ? Math.round((problemsSolved / totalSubmissions) * 100)
      : 0;

    const quizAttempts = await QuizAttempt.countDocuments({
      userId: req.user.userId
    });

    const avgQuizAccuracy = await QuizAttempt.aggregate([
      { $match: { userId: req.user.userId } },
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: '$accuracy' }
        }
      }
    ]);

    const recentSubmissions = await Submission.find({
      userId: req.user.userId
    })
      .populate('problemId', 'title difficulty')
      .sort({ submittedAt: -1 })
      .limit(5);

    const recentQuizzes = await QuizAttempt.find({
      userId: req.user.userId
    })
      .sort({ submittedAt: -1 })
      .limit(5);

    // Calculate actual streak
    const submissions = await Submission.find({
      userId: req.user.userId,
      status: 'Accepted'
    }).sort({ submittedAt: -1 });

    const activeDates = new Set(
      submissions.map(sub =>
        new Date(sub.submittedAt).toISOString().split('T')[0]
      )
    );

    let streak = 0;
    let currentDate = new Date();

    while (activeDates.has(currentDate.toISOString().split('T')[0])) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    res.json({
      problemsSolved,
      totalSubmissions,
      codingAccuracy,
      quizAttempts,
      avgQuizAccuracy: avgQuizAccuracy[0]?.avgAccuracy || 0,
      recentSubmissions,
      recentQuizzes,
      streak
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;