import express from 'express';
import Submission from '../models/Submission.js';
import CodingProblem from '../models/CodingProblem.js';
import auth from '../middleware/auth.js';

const router = express.Router();


// ======================================================
// RUN CODE ON RUNLET
// ======================================================

const executeCode = async (language, code, input) => {

  const response = await fetch(
    'https://runlet.codealong.live/execute',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language,
        code,
        stdin: input || ''
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Code execution service returned ${response.status}`
    );
  }

  return await response.json();
};


// ======================================================
// NORMALIZE OUTPUT
// ======================================================

const normalizeOutput = (output) => {
  return String(output ?? '')
    .trim()
    .replace(/\r\n/g, '\n');
};


// ======================================================
// SUBMIT CODE
// ======================================================

router.post('/', auth, async (req, res) => {

  try {

    const {
      problemId,
      language,
      code
    } = req.body;


    // --------------------------------------------------
    // Validate request
    // --------------------------------------------------

    if (!problemId || !language || !code) {

      return res.status(400).json({
        message:
          'problemId, language and code are required'
      });

    }


    // --------------------------------------------------
    // Get problem from MongoDB
    // --------------------------------------------------

    const problem =
      await CodingProblem.findById(problemId);


    if (!problem) {

      return res.status(404).json({
        message: 'Coding problem not found'
      });

    }


    // --------------------------------------------------
    // Check test cases
    // --------------------------------------------------

    if (
      !problem.testCases ||
      problem.testCases.length === 0
    ) {

      return res.status(400).json({
        message:
          'This problem does not have test cases'
      });

    }


    console.log(
      `Running ${problem.testCases.length} test cases`
    );


    // --------------------------------------------------
    // Run every test case
    // --------------------------------------------------

    const testResults = [];

    let finalStatus = 'Accepted';

    let totalRuntime = 0;

    let totalMemory = 0;


    for (
      let i = 0;
      i < problem.testCases.length;
      i++
    ) {

      const testCase =
        problem.testCases[i];


      console.log(
        `Running test case ${i + 1}`
      );


      try {

        const result = await executeCode(
          language,
          code,
          testCase.input
        );


        console.log(
          'Runlet result:',
          result
        );


        // --------------------------------------------------
        // Runtime / compile errors
        // --------------------------------------------------

        if (
          result.status === 'CE' ||
          result.status === 'COMPILATION_ERROR'
        ) {

          finalStatus = 'Runtime Error';

          testResults.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result.stderr || '',
            status: 'Compile Error'
          });

          break;

        }


        if (
          result.status === 'RE' ||
          result.status === 'RUNTIME_ERROR'
        ) {

          finalStatus = 'Runtime Error';

          testResults.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result.stderr || '',
            status: 'Runtime Error'
          });

          break;

        }


        if (
          result.status === 'TLE' ||
          result.status === 'TIME_LIMIT_EXCEEDED'
        ) {

          finalStatus =
            'Time Limit Exceeded';

          testResults.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: '',
            status: 'Time Limit Exceeded'
          });

          break;

        }


        // --------------------------------------------------
        // Actual output
        // --------------------------------------------------

        const actualOutput =
          normalizeOutput(
            result.stdout ??
            result.output ??
            ''
          );


        const expectedOutput =
          normalizeOutput(
            testCase.output
          );


        const passed =
          actualOutput === expectedOutput;


        testResults.push({

          input: testCase.input,

          expectedOutput,

          actualOutput,

          status:
            passed
              ? 'Passed'
              : 'Failed'

        });


        if (!passed) {

          finalStatus = 'Wrong Answer';

          break;

        }


        // --------------------------------------------------
        // Runtime / memory
        // --------------------------------------------------

        if (result.runtime) {

          totalRuntime +=
            Number(result.runtime) || 0;

        }


        if (result.memory) {

          totalMemory =
            Math.max(
              totalMemory,
              Number(result.memory) || 0
            );

        }

      } catch (executionError) {

        console.error(
          'Execution error:',
          executionError
        );


        finalStatus =
          'Runtime Error';


        testResults.push({

          input: testCase.input,

          expectedOutput:
            testCase.output,

          actualOutput: '',

          status:
            'Runtime Error'

        });


        break;

      }

    }


    // --------------------------------------------------
    // Save submission
    // --------------------------------------------------

    const submission =
      new Submission({

        userId:
          req.user.userId,

        problemId,

        language,

        code,

        status:
          finalStatus,

        runtime:
          totalRuntime,

        memory:
          totalMemory

      });


    await submission.save();


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.json({

      _id:
        submission._id,

      status:
        finalStatus,

      runtime:
        totalRuntime,

      memory:
        totalMemory,

      testCases:
        testResults,

      submittedAt:
        submission.submittedAt

    });


  } catch (error) {

    console.error(
      'Submission Error:',
      error
    );


    res.status(500).json({

      message:
        error.message ||
        'Server error'

    });

  }

});


// ======================================================
// GET USER SUBMISSIONS
// ======================================================

router.get('/', auth, async (req, res) => {

  try {

    const submissions =
      await Submission.find({
        userId: req.user.userId
      })
      .populate(
        'problemId',
        'title difficulty'
      )
      .sort({
        submittedAt: -1
      });


    res.json(submissions);

  } catch (error) {

    console.error(
      'Error fetching submissions:',
      error
    );


    res.status(500).json({
      message: 'Server error'
    });

  }

});


export default router;