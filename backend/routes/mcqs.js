import express from 'express';
import MCQQuestion from '../models/MCQQuestion.js';
import geminiService from '../services/geminiService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { topic, difficulty, limit } = req.query;
    let query = {};

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const questions = await MCQQuestion.find(query)
      .limit(parseInt(limit) || 0);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    // Validate input
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ message: 'Topic is required and must be a non-empty string' });
    }

    if (!difficulty || !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Difficulty must be Easy, Medium, or Hard' });
    }

    if (!count || typeof count !== 'number' || count < 1 || count > 20) {
      return res.status(400).json({ message: 'Count must be a number between 1 and 20' });
    }

    // Generate MCQs using Gemini
    const generatedQuestions = await geminiService.generateMCQs(topic, difficulty, count);

    // Optionally save to database
    const savedQuestions = await MCQQuestion.insertMany(generatedQuestions);

    res.json({
      message: `Successfully generated ${count} MCQs for ${topic}`,
      questions: savedQuestions
    });
  } catch (error) {
    console.error('MCQ Generation Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate MCQs',
      error: error.message 
    });
  }
});

export default router;
