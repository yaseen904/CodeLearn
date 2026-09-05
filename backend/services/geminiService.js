import { GoogleGenAI } from '@google/genai';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const models = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash'
];


// ======================================================
// MCQ GENERATION
// ======================================================

const generateMCQs = async (topic, difficulty, count) => {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = `Generate exactly ${count} multiple choice questions about ${topic} with ${difficulty} difficulty level.

Requirements:
- Each question must have exactly 4 options
- Provide the correct answer index (0-3)
- Include a brief explanation for the correct answer
- Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "question": "question text here",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": 0,
      "explanation": "explanation here"
    }
  ]
}

Make sure the questions are relevant to ${topic} and appropriate for ${difficulty} difficulty level.`;

  let lastError;

  for (const model of models) {

    for (let attempt = 1; attempt <= 2; attempt++) {

      try {

        console.log(
          `Trying Gemini model: ${model}, attempt: ${attempt}`
        );

        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            maxOutputTokens: 2048
          }
        });

        const text =
          response.text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text ||
          '';

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error(
            'Failed to extract JSON from Gemini response'
          );
        }

        const parsedResponse = JSON.parse(jsonMatch[0]);

        if (
          !parsedResponse.questions ||
          !Array.isArray(parsedResponse.questions)
        ) {
          throw new Error(
            'Invalid response format from Gemini'
          );
        }

        const validatedQuestions =
          parsedResponse.questions.map((q, index) => {

            if (
              !q.question ||
              !Array.isArray(q.options) ||
              q.options.length !== 4
            ) {
              throw new Error(
                `Invalid question format at index ${index}`
              );
            }

            if (
              typeof q.correctAnswer !== 'number' ||
              q.correctAnswer < 0 ||
              q.correctAnswer > 3
            ) {
              throw new Error(
                `Invalid correctAnswer at index ${index}`
              );
            }

            return {
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || '',
              topic,
              difficulty
            };
          });

        if (validatedQuestions.length !== count) {
          throw new Error(
            `Expected ${count} questions, got ${validatedQuestions.length}`
          );
        }

        console.log(
          `Gemini success using ${model}`
        );

        return validatedQuestions;

      } catch (error) {

        lastError = error;

        console.error(
          `Gemini error with ${model}, attempt ${attempt}:`,
          error.message
        );

        const status = error.status || error.code;

        if (
          status === 429 ||
          status === 500 ||
          status === 503 ||
          status === 504
        ) {

          if (attempt < 2) {
            await sleep(1500 * attempt);
            continue;
          }

          break;
        }

        break;
      }
    }
  }

  console.error(
    'All Gemini models failed:',
    lastError
  );

  throw new Error(
    'AI service is temporarily unavailable. Please try again in a few seconds.'
  );
};


// ======================================================
// AI CODING PROBLEM GENERATION
// ======================================================

const generateCodingProblem = async (
  language,
  topic,
  difficulty
) => {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = `Create ONE unique coding problem.

Topic: ${topic}
Difficulty: ${difficulty}
Programming Language: ${language}

The problem should be suitable for a coding practice platform.

Requirements:

1. Create a clear and realistic coding problem.
2. The problem must match the selected topic.
3. Difficulty must be ${difficulty}.
4. Provide a title.
5. Provide a detailed problem description.
6. Provide input format.
7. Provide output format.
8. Provide constraints.
9. Provide exactly 2 sample test cases.
10. Provide starter code for ${language}.
11. Provide hidden test cases for evaluating the user's code.
12. Hidden test cases must contain inputs and expected outputs.
13. Return ONLY valid JSON.
14. Do NOT include markdown.
15. Do NOT include code fences.

Return exactly this JSON structure:

{
  "title": "Problem title",
  "description": "Detailed problem description",
  "inputFormat": "Input format",
  "outputFormat": "Output format",
  "constraints": [
    "constraint 1",
    "constraint 2"
  ],
  "examples": [
    {
      "input": "example input",
      "output": "example output",
      "explanation": "explanation"
    },
    {
      "input": "example input",
      "output": "example output",
      "explanation": "explanation"
    }
  ],
  "starterCode": "starter code for ${language}",
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected output"
    },
    {
      "input": "test input",
      "expectedOutput": "expected output"
    },
    {
      "input": "test input",
      "expectedOutput": "expected output"
    }
  ]
}

Make sure the generated problem is solvable using ${language}.
Make sure every test case has a correct expected output.
Make the test cases relevant to the problem.
`;


  let lastError;

  for (const model of models) {

    for (let attempt = 1; attempt <= 2; attempt++) {

      try {

        console.log(
          `Generating coding problem using ${model}, attempt: ${attempt}`
        );

        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            maxOutputTokens: 4096
          }
        });

        const text =
          response.text ||
          response.candidates?.[0]?.content?.parts?.[0]?.text ||
          '';

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error(
            'Failed to extract coding problem JSON'
          );
        }

        const problem = JSON.parse(jsonMatch[0]);


        // Basic validation
        if (!problem.title) {
          throw new Error(
            'Generated problem has no title'
          );
        }

        if (!problem.description) {
          throw new Error(
            'Generated problem has no description'
          );
        }

        if (!problem.starterCode) {
          throw new Error(
            'Generated problem has no starter code'
          );
        }

        if (
          !Array.isArray(problem.examples) ||
          problem.examples.length < 2
        ) {
          throw new Error(
            'Generated problem must contain at least 2 examples'
          );
        }

        if (
          !Array.isArray(problem.testCases) ||
          problem.testCases.length < 3
        ) {
          throw new Error(
            'Generated problem must contain at least 3 test cases'
          );
        }


        console.log(
          `Coding problem generated successfully using ${model}`
        );


        return {
          ...problem,
          language,
          topic,
          difficulty,
          generatedByAI: true
        };


      } catch (error) {

        lastError = error;

        console.error(
          `Coding problem generation error with ${model}, attempt ${attempt}:`,
          error.message
        );

        const status = error.status || error.code;

        if (
          status === 429 ||
          status === 500 ||
          status === 503 ||
          status === 504
        ) {

          if (attempt < 2) {
            await sleep(1500 * attempt);
            continue;
          }

          break;
        }

        break;
      }
    }
  }


  console.error(
    'All coding problem generation attempts failed:',
    lastError
  );

  throw new Error(
    'AI coding problem service is temporarily unavailable. Please try again in a few seconds.'
  );
};


// ======================================================
// EXPORT
// ======================================================

export default {
  generateMCQs,
  generateCodingProblem
};

