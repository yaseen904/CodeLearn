import express from 'express';

const router = express.Router();

const LEETCODE_API = 'https://leetcode.com/graphql/';


// Remove HTML from problem description
const cleanHtml = (html = '') => {
  return html
    .replace(/<pre>/gi, '\n')
    .replace(/<\/pre>/gi, '\n')
    .replace(/<code>/gi, '')
    .replace(/<\/code>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
};


// ======================================================
// SEARCH LEETCODE PROBLEMS
// ======================================================

router.get('/search', async (req, res) => {
  try {
    const search = req.query.q?.trim();

    if (!search) {
      return res.status(400).json({
        message: 'Search query is required'
      });
    }

    const query = `
      query problemsetQuestionList(
        $categorySlug: String,
        $limit: Int,
        $skip: Int,
        $filters: QuestionListFilterInput
      ) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            acRate
            difficulty
            frontendQuestionId: questionFrontendId
            paidOnly: isPaidOnly
            title
            titleSlug
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;

    const variables = {
      categorySlug: '',
      limit: 50,
      skip: 0,
      filters: {
        searchKeywords: search
      }
    };

    const response = await fetch(LEETCODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        query,
        variables,
        operationName: 'problemsetQuestionList'
      })
    });

    const data = await response.json();

    console.log('LeetCode status:', response.status);
    console.log('LeetCode response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({
        message: `LeetCode returned ${response.status}`
      });
    }

    if (data.errors) {
      console.error('LeetCode GraphQL Error:', data.errors);

      return res.status(500).json({
        message: 'LeetCode search failed',
        errors: data.errors
      });
    }

    const result = data.data?.problemsetQuestionList;

    if (!result) {
      return res.status(500).json({
        message: 'Invalid response from LeetCode'
      });
    }

    let questions = result.questions || [];

    // Exact number search
    if (/^\d+$/.test(search)) {
      questions = questions.filter(
        question =>
          String(question.frontendQuestionId) === search
      );
    }

    res.json({
      total: questions.length,
      results: questions
    });

  } catch (error) {
    console.error('LeetCode search error:', error);

    res.status(500).json({
      message: error.message || 'Failed to search LeetCode problems'
    });
  }
});


// ======================================================
// GET COMPLETE LEETCODE PROBLEM
// ======================================================

router.get('/problem/:titleSlug', async (req, res) => {
  try {
    const { titleSlug } = req.params;

    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          content
          difficulty
          exampleTestcases
          topicTags {
            name
            slug
          }
          hints
          codeSnippets {
            lang
            langSlug
            code
          }
        }
      }
    `;

    const response = await fetch(LEETCODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        query,
        variables: {
          titleSlug
        },
        operationName: 'questionData'
      })
    });

    const data = await response.json();

    console.log('LeetCode problem response:', response.status);

    if (!response.ok) {
      return res.status(response.status).json({
        message: `LeetCode returned ${response.status}`
      });
    }

    if (data.errors) {
      console.error('LeetCode problem error:', data.errors);

      return res.status(500).json({
        message: 'Failed to fetch LeetCode problem',
        errors: data.errors
      });
    }

    const question = data.data?.question;

    if (!question) {
      return res.status(404).json({
        message: 'LeetCode problem not found'
      });
    }

    const formattedProblem = {
      leetcodeId: question.questionFrontendId,
      title: question.title,
      titleSlug: question.titleSlug,
      description: cleanHtml(question.content),
      difficulty: question.difficulty,

      examples: question.exampleTestcases
        ? question.exampleTestcases.split('\n')
        : [],

      topics: question.topicTags?.map(tag => tag.name) || [],

      hints: question.hints || [],

      codeSnippets: question.codeSnippets || []
    };

    res.json(formattedProblem);

  } catch (error) {
    console.error('LeetCode problem error:', error);

    res.status(500).json({
      message: error.message || 'Failed to fetch LeetCode problem'
    });
  }
});


export default router;