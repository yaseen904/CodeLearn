import express from 'express';
import QuizAttempt from '../models/QuizAttempt.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { topic, difficulty, questions, score, totalQuestions, accuracy, timeTaken } = req.body;

    const quizAttempt = new QuizAttempt({
      userId: req.user.userId,
      topic,
      difficulty,
      questions,
      score,
      totalQuestions,
      accuracy,
      timeTaken
    });

    await quizAttempt.save();
    res.json(quizAttempt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const history = await QuizAttempt.find({ userId: req.user.userId })
      .sort({ submittedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
