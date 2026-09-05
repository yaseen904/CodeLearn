import express from 'express';
import auth from '../middleware/auth.js';
import codeExecutor from '../services/codeExecutor.js';

const router = express.Router();

/* ==================================================
   EXTRACT ARRAY FROM LEETCODE INPUT
==================================================

Possible inputs:

nums = [-1,0,1,2,-1,-4]

OR

[-1,0,1,2,-1,-4]

We extract:

-1,0,1,2,-1,-4

================================================== */

const extractArrayValues = (input) => {
  const text = String(input || '').trim();

  const match = text.match(/\[([^\]]*)\]/);

  if (!match) {
    return '';
  }

  return match[1]
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .join(',');
};


/* ==================================================
   BUILD 3SUM JAVA PROGRAM
================================================== */

const buildThreeSumJavaCode = (userCode, input) => {

  /*
   * LeetCode normally gives:
   *
   * public class Solution
   *
   * But Java cannot have:
   *
   * public class Solution
   * public class Main
   *
   * in the same file.
   *
   * So we make Solution non-public.
   */

  const solutionCode = userCode.replace(
    /public\s+class\s+Solution/g,
    'class Solution'
  );

  const numbers = extractArrayValues(input);

  console.log('Parsed 3Sum numbers:', numbers);

  /*
   * Create a complete executable Java program.
   */

  const wrappedCode = `
import java.util.*;

${solutionCode}

public class Main {

    public static void main(String[] args) {

        int[] nums = new int[]{${numbers}};

        Solution solution = new Solution();

        List<List<Integer>> result =
            solution.threeSum(nums);

        System.out.println(result);
    }
}
`;

  console.log('Generated Java wrapper:');
  console.log(wrappedCode);

  return wrappedCode;
};


/* ==================================================
   EXECUTE CODE USING DOCKER
================================================== */

const executeDocker = async (
  language,
  code,
  stdin = ''
) => {

  console.log(
    `Executing ${language} code using Docker...`
  );

  const result = await codeExecutor.executeCode(
    language,
    code,
    stdin
  );

  return result;
};


/* ==================================================
   EXECUTE CODE ROUTE
================================================== */

router.post(
  '/execute',
  auth,
  async (req, res) => {

    try {

      const {
        language,
        code,
        input,
        isLeetCode,
        problemSlug
      } = req.body;


      /* ============================================
         VALIDATION
      ============================================ */

      if (!language || !code) {

        return res.status(400).json({
          message:
            'Language and code are required'
        });

      }


      /* ============================================
         LEETCODE 3SUM
      ============================================ */

      if (
        isLeetCode &&
        problemSlug === '3sum'
      ) {

        console.log(
          '===================================='
        );

        console.log(
          'LEETCODE 3SUM EXECUTION'
        );

        console.log(
          'Language:',
          language
        );

        console.log(
          'Problem:',
          problemSlug
        );

        console.log(
          'Original Input:',
          input
        );

        console.log(
          '===================================='
        );


        /* ------------------------------------------
           3SUM CURRENTLY SUPPORTS JAVA
        ------------------------------------------ */

        if (language !== 'java') {

          return res.status(400).json({
            message:
              '3Sum adapter currently supports Java only.'
          });

        }


        /* ------------------------------------------
           CHECK INPUT
        ------------------------------------------ */

        const numbers =
          extractArrayValues(input);

        if (!numbers) {

          return res.status(400).json({
            message:
              'Could not read the 3Sum input. Expected format like nums = [-1,0,1,2,-1,-4].'
          });

        }


        /* ------------------------------------------
           CREATE JAVA WRAPPER
        ------------------------------------------ */

        const wrappedCode =
          buildThreeSumJavaCode(
            code,
            input
          );


        /* ------------------------------------------
           EXECUTE USING DOCKER
        ------------------------------------------ */

        const result =
          await executeDocker(
            'java',
            wrappedCode,
            ''
          );


        console.log(
          '3Sum Docker result:',
          result
        );


        return res.json({

          status:
            result.status,

          stdout:
            result.stdout || '',

          stderr:
            result.stderr || '',

          time:
            result.time || 0,

          memory:
            result.memory || 0

        });

      }


      /* ============================================
         NORMAL CODE EXECUTION
      ============================================ */

      console.log(
        `Executing ${language} code...`
      );


      const result =
        await executeDocker(
          language,
          code,
          input || ''
        );


      return res.json({

        status:
          result.status,

        stdout:
          result.stdout || '',

        stderr:
          result.stderr || '',

        time:
          result.time || 0,

        memory:
          result.memory || 0

      });


    } catch (error) {

      console.error(
        '===================================='
      );

      console.error(
        'CODE EXECUTION ERROR'
      );

      console.error(error);

      console.error(
        '===================================='
      );


      return res.status(500).json({

        message:
          error.message ||
          'Code execution failed'

      });

    }

  }
);


export default router;
