import express from 'express';
import CodingProblem from '../models/CodingProblem.js';
import auth from '../middleware/auth.js';
import geminiService from '../services/geminiService.js';

const router = express.Router();


// ==========================================
// GET ALL CODING PROBLEMS
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { topic, difficulty, search } = req.query;

    const query = {};

    if (topic) {
      query.topic = topic;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }

    const problems = await CodingProblem.find(query);

    res.json(problems);

  } catch (error) {
    console.error('Error fetching problems:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});


// ==========================================
// AI GENERATE CODING PROBLEM
// ==========================================
router.post('/generate', auth, async (req, res) => {
  try {

    const {
      language,
      topic,
      difficulty
    } = req.body;

    // Validate input
    if (!language || !topic || !difficulty) {
      return res.status(400).json({
        message: 'Language, topic and difficulty are required'
      });
    }

    console.log(
      `Generating AI problem: ${language} | ${topic} | ${difficulty}`
    );


    // ==========================================
    // GENERATE PROBLEM USING GEMINI
    // ==========================================

    const generatedProblem =
      await geminiService.generateCodingProblem(
        language,
        topic,
        difficulty
      );


    // ==========================================
    // CONVERT AI TEST CASE FORMAT
    // expectedOutput -> output
    // ==========================================

    const testCases = (generatedProblem.testCases || []).map(
      (testCase) => ({
        input: testCase.input,
        output:
          testCase.output ??
          testCase.expectedOutput ??
          ''
      })
    );


    // ==========================================
    // SAVE AI PROBLEM TO MONGODB
    // ==========================================

    const problem = new CodingProblem({

      title: generatedProblem.title,

      description: generatedProblem.description,

      topic: generatedProblem.topic || topic,

      difficulty:
        generatedProblem.difficulty || difficulty,

      supportedLanguages: [
        language
      ],

      examples: generatedProblem.examples || [],

      constraints:
        generatedProblem.constraints || [],

      testCases

    });


    await problem.save();


    console.log(
      `AI problem saved to MongoDB: ${problem._id}`
    );


    // ==========================================
    // RETURN PROBLEM TO FRONTEND
    // ==========================================

    res.json({

      _id: problem._id,

      title: problem.title,

      description: problem.description,

      topic: problem.topic,

      difficulty: problem.difficulty,

      supportedLanguages:
        problem.supportedLanguages,

      examples: problem.examples,

      constraints: problem.constraints,

      testCases: problem.testCases,

      starterCode:
        generatedProblem.starterCode,

      language,

      generatedByAI: true

    });

  } catch (error) {

    console.error(
      'AI Coding Problem Error:',
      error
    );

    res.status(500).json({
      message:
        error.message ||
        'Failed to generate coding problem'
    });
  }
});


// ==========================================
// GET SINGLE CODING PROBLEM
// ==========================================
router.get('/:id', async (req, res) => {
  try {

    const problem =
      await CodingProblem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found'
      });
    }

    res.json(problem);

  } catch (error) {

    console.error(
      'Error fetching problem:',
      error
    );

    res.status(500).json({
      message: 'Server error'
    });
  }
});


export default router;