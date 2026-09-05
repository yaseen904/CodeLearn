import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';

import Badge from '../components/Badge';
import Button from '../components/Button';
import Select from '../components/Select';
import Card from '../components/Card';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

import './CodingProblem.css';


const languages = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' }
];


const defaultCode = {
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeLearn!");
    }
}`,

  python: `def main():
    print("Hello, CodeLearn!")

if __name__ == "__main__":
    main()`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, CodeLearn!";
    return 0;
}`,

  javascript: `console.log("Hello, CodeLearn!");`
};


/* ==================================================
   LEETCODE STARTER CODE
================================================== */

const getLeetCodeStarterCode = (problem, language) => {
  if (!problem?.codeSnippets) return '';

  const snippet = problem.codeSnippets.find(
    item => item.langSlug === language
  );

  return snippet?.code || '';
};


/* ==================================================
   EXAMPLES
================================================== */

const extractLeetCodeExamples = (description = '') => {
  const text = description
    .replace(/<pre>/gi, '\n')
    .replace(/<\/pre>/gi, '\n')
    .replace(/<code>/gi, '')
    .replace(/<\/code>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n');

  const examples = [];

  const regex =
    /Example\s+\d+\s*:\s*Input:\s*([\s\S]*?)Output:\s*([\s\S]*?)(?:Explanation:\s*([\s\S]*?))?(?=Example\s+\d+\s*:|$)/gi;

  let match;

  while ((match = regex.exec(text)) !== null) {
    examples.push({
      input: match[1]?.trim() || '',
      output: match[2]?.trim() || '',
      explanation: match[3]?.trim() || ''
    });
  }

  return examples;
};


const getExamples = (problem) => {
  if (!problem) return [];

  if (
    Array.isArray(problem.examples) &&
    problem.examples.length > 0 &&
    typeof problem.examples[0] === 'object'
  ) {
    return problem.examples;
  }

  if (problem.description) {
    return extractLeetCodeExamples(problem.description);
  }

  return [];
};


/* ==================================================
   COMPONENT
================================================== */

const CodingProblem = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const incomingProblem = location.state?.problem;

  const isLeetCodeProblem =
    Boolean(location.state?.isLeetCode);

  const isAIProblem =
    Boolean(incomingProblem);


  /* ==================================================
     STATE
  ================================================== */

  const [problem, setProblem] = useState(
    incomingProblem || null
  );

  const [language, setLanguage] = useState(
    location.state?.language ||
    incomingProblem?.language ||
    'java'
  );

  const [code, setCode] = useState('');

  const [loading, setLoading] = useState(
    !incomingProblem
  );

  const [running, setRunning] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [customInput, setCustomInput] = useState('');

  const [result, setResult] = useState(null);


  /* ==================================================
     LOAD NORMAL PROBLEM
  ================================================== */

  useEffect(() => {

    if (isLeetCodeProblem || isAIProblem) {
      setLoading(false);
      return;
    }

    const loadProblem = async () => {

      try {

        setLoading(true);

        const response = await api.get(
          `/problems/${id}`
        );

        setProblem(response.data);

      } catch (error) {

        console.error(
          'Problem loading error:',
          error
        );

      } finally {

        setLoading(false);

      }
    };

    loadProblem();

  }, [
    id,
    isLeetCodeProblem,
    isAIProblem
  ]);


  /* ==================================================
     SET EDITOR CODE
  ================================================== */

  useEffect(() => {

    if (!problem) return;


    if (isLeetCodeProblem) {

      const starter =
        getLeetCodeStarterCode(
          problem,
          language
        );

      setCode(
        starter ||
        defaultCode[language] ||
        ''
      );

      return;
    }


    if (isAIProblem) {

      setCode(
        problem.starterCode ||
        defaultCode[language] ||
        ''
      );

      return;
    }


    setCode(
      defaultCode[language] || ''
    );

  }, [
    problem,
    language,
    isLeetCodeProblem,
    isAIProblem
  ]);


  /* ==================================================
     LANGUAGE CHANGE
  ================================================== */

  const handleLanguageChange = (e) => {

    const newLanguage = e.target.value;

    setLanguage(newLanguage);

    setResult(null);


    if (isLeetCodeProblem) {

      const starter =
        getLeetCodeStarterCode(
          problem,
          newLanguage
        );

      setCode(
        starter ||
        defaultCode[newLanguage] ||
        ''
      );

      return;
    }


    if (isAIProblem) {

      setCode(
        problem?.starterCode ||
        defaultCode[newLanguage] ||
        ''
      );

      return;
    }


    setCode(
      defaultCode[newLanguage] || ''
    );

  };


  /* ==================================================
     EXAMPLES
  ================================================== */

  const examples = getExamples(problem);


  /* ==================================================
     RUN INPUT
  ================================================== */

  const getRunInput = () => {

    if (customInput.trim()) {
      return customInput;
    }

    if (examples.length > 0) {
      return examples[0].input || '';
    }

    return '';

  };


  /* ==================================================
     RUN
  ================================================== */

  const handleRun = async () => {

    if (!problem) return;

    if (!code.trim()) {

      setResult({
        type: 'error',
        title: 'No Code',
        message: 'Please write some code first.'
      });

      return;
    }


    setRunning(true);
    setResult(null);


    try {

      const response = await api.post(
        '/code/execute',
        {
          language,
          code,
          input: getRunInput(),

          isLeetCode: isLeetCodeProblem,

          problemSlug:
            problem.titleSlug || ''
        }
      );


      const data = response.data;


      if (data.status === 'OK') {

        setResult({
          type: 'success',
          title: 'Accepted',
          stdout: data.stdout || '',
          stderr: data.stderr || '',
          time: data.time,
          memory: data.memory
        });

      } else {

        setResult({
          type: 'error',
          title: data.status || 'Execution Error',
          stdout: data.stdout || '',
          stderr: data.stderr || ''
        });

      }

    } catch (error) {

      console.error(
        'Run error:',
        error
      );

      setResult({
        type: 'error',
        title: 'Execution Failed',
        message:
          error.response?.data?.message ||
          error.message ||
          'Failed to execute code.'
      });

    } finally {

      setRunning(false);

    }

  };


  /* ==================================================
     SUBMIT
  ================================================== */

  const handleSubmit = async () => {

    if (!problem) return;

    if (!code.trim()) {

      setResult({
        type: 'error',
        title: 'No Code',
        message: 'Please write some code first.'
      });

      return;
    }


    /* -----------------------------------------------
       LEETCODE
    ------------------------------------------------ */

    if (isLeetCodeProblem) {

      setSubmitting(true);
      setResult(null);

      try {

        const testInputs =
          problem.exampleTestcases
            ? problem.exampleTestcases
                .split('\n')
                .filter(Boolean)
            : examples.map(
                example => example.input || ''
              );


        if (testInputs.length === 0) {

          setResult({
            type: 'info',
            title: 'No Sample Tests',
            message:
              'No sample test cases are available for this problem.'
          });

          return;
        }


        let passed = 0;

        const testResults = [];


        for (const input of testInputs) {

          const response = await api.post(
            '/code/execute',
            {
              language,
              code,
              input,
              isLeetCode: true,
              problemSlug:
                problem.titleSlug || ''
            }
          );


          const data = response.data;


          if (data.status === 'OK') {
            passed++;
          }


          testResults.push({
            input,
            output: data.stdout || '',
            status: data.status
          });

        }


        setResult({
          type:
            passed === testInputs.length
              ? 'success'
              : 'error',

          title:
            passed === testInputs.length
              ? 'All Sample Tests Passed'
              : 'Some Tests Failed',

          message:
            `${passed} / ${testInputs.length} sample tests passed.`,

          outputs: testResults
        });


      } catch (error) {

        console.error(
          'LeetCode submit error:',
          error
        );

        setResult({
          type: 'error',
          title: 'Submit Failed',
          message:
            error.response?.data?.message ||
            error.message ||
            'Failed to submit code.'
        });

      } finally {

        setSubmitting(false);

      }

      return;
    }


    /* -----------------------------------------------
       NORMAL CODELEARN PROBLEM
    ------------------------------------------------ */

    setSubmitting(true);
    setResult(null);


    try {

      const response = await api.post(
        '/submissions',
        {
          problemId:
            problem._id || id,

          language,

          code
        }
      );


      const data = response.data;


      setResult({
        type:
          data.status === 'Accepted'
            ? 'success'
            : 'error',

        title:
          data.status || 'Submission Result',

        message:
          data.message ||
          (
            data.status === 'Accepted'
              ? 'All test cases passed!'
              : 'Some test cases failed.'
          ),

        stdout: data.stdout || '',
        stderr: data.stderr || '',
        time: data.runtime,
        memory: data.memory,
        testCases: data.testCases || []
      });


    } catch (error) {

      console.error(
        'Submit error:',
        error
      );

      setResult({
        type: 'error',
        title: 'Submission Failed',
        message:
          error.response?.data?.message ||
          error.message ||
          'Failed to submit code.'
      });

    } finally {

      setSubmitting(false);

    }

  };


  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {

    return (
      <LoadingState
        message="Loading problem..."
      />
    );

  }


  if (!problem) {

    return (

      <div className="coding-problem-page">

        <Card>

          <h2>
            Problem not found
          </h2>

          <Button
            onClick={() =>
              navigate('/coding-practice')
            }
          >
            ← Back
          </Button>

        </Card>

      </div>

    );

  }


  /* ==================================================
     DATA
  ================================================== */

  const problemNumber =
    problem.leetcodeId ||
    problem.questionFrontendId;

  const topicText =
    problem.topic ||
    (
      Array.isArray(problem.topics)
        ? problem.topics.join(' • ')
        : ''
    );


  /* ==================================================
     UI
  ================================================== */

  return (

    <div className="coding-problem-page">


      {/* ============================================
          TOP BAR
      ============================================ */}

      <div className="coding-problem-topbar">

        <button
          className="problem-back-btn"
          onClick={() =>
            navigate('/coding-practice')
          }
        >
          ← Back
        </button>


        <div className="problem-heading">

          <div className="problem-title-line">

            {isLeetCodeProblem &&
              problemNumber && (

                <span className="problem-number">
                  #{problemNumber}
                </span>

              )}

            <h1>
              {problem.title}
            </h1>

          </div>


          <div className="problem-badges">

            {problem.difficulty && (
              <Badge>
                {problem.difficulty}
              </Badge>
            )}


            {isLeetCodeProblem && (
              <Badge>
                LeetCode
              </Badge>
            )}


            {isAIProblem && (
              <Badge>
                ✨ AI Generated
              </Badge>
            )}


            {topicText && (
              <Badge>
                {topicText}
              </Badge>
            )}

          </div>

        </div>


        <div className="problem-language">

          <Select
            label="Language"
            value={language}
            onChange={handleLanguageChange}
            options={languages}
          />

        </div>

      </div>



      {/* ============================================
          WORKSPACE
      ============================================ */}

      <div className="coding-workspace">


        {/* ==========================================
            LEFT PROBLEM PANEL
        ========================================== */}

        <section className="problem-panel">

          <Card className="problem-card">

            <h2>
              Problem
            </h2>


            <div
              className={
                isLeetCodeProblem
                  ? 'leetcode-description'
                  : 'normal-description'
              }
            >

              {isLeetCodeProblem ? (

                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      problem.description || ''
                  }}
                />

              ) : (

                <p>
                  {problem.description}
                </p>

              )}

            </div>


            {/* INPUT / OUTPUT */}

            {(problem.inputFormat ||
              problem.outputFormat) && (

              <div className="format-section">

                {problem.inputFormat && (

                  <div>

                    <h3>
                      Input Format
                    </h3>

                    <p>
                      {problem.inputFormat}
                    </p>

                  </div>

                )}


                {problem.outputFormat && (

                  <div>

                    <h3>
                      Output Format
                    </h3>

                    <p>
                      {problem.outputFormat}
                    </p>

                  </div>

                )}

              </div>

            )}


            {/* EXAMPLES */}

            {examples.length > 0 && (

              <div className="examples-section">

                <h3>
                  Examples
                </h3>


                {examples.map(
                  (example, index) => (

                    <div
                      className="example-item"
                      key={index}
                    >

                      <div className="example-title">
                        Example {index + 1}
                      </div>


                      {example.input && (

                        <div className="example-block">

                          <span>
                            Input
                          </span>

                          <pre>
                            {example.input}
                          </pre>

                        </div>

                      )}


                      {example.output && (

                        <div className="example-block">

                          <span>
                            Output
                          </span>

                          <pre>
                            {example.output}
                          </pre>

                        </div>

                      )}


                      {example.explanation && (

                        <div className="example-explanation">

                          <span>
                            Explanation
                          </span>

                          <p>
                            {example.explanation}
                          </p>

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            )}


            {/* CONSTRAINTS */}

            {problem.constraints?.length > 0 && (

              <div className="constraints-section">

                <h3>
                  Constraints
                </h3>

                <ul>

                  {problem.constraints.map(
                    (constraint, index) => (

                      <li key={index}>
                        {constraint}
                      </li>

                    )
                  )}

                </ul>

              </div>

            )}


            {/* TOPICS */}

            {isLeetCodeProblem &&
              problem.topics?.length > 0 && (

                <div className="topics-section">

                  <h3>
                    Topics
                  </h3>

                  <div className="topics-list">

                    {problem.topics.map(
                      topic => (

                        <Badge key={topic}>
                          {topic}
                        </Badge>

                      )
                    )}

                  </div>

                </div>

              )}

          </Card>

        </section>



        {/* ==========================================
            RIGHT EDITOR PANEL
        ========================================== */}

        <section className="editor-panel">


          {/* EDITOR */}

          <Card className="editor-card">

            <div className="editor-toolbar">

              <div className="editor-language">

                <span className="editor-dot" />

                {languages.find(
                  item =>
                    item.value === language
                )?.label}

              </div>


              <div className="editor-buttons">

                <Button
                  variant="secondary"
                  onClick={handleRun}
                  disabled={
                    running ||
                    submitting
                  }
                >
                  {running
                    ? 'Running...'
                    : '▶ Run'}
                </Button>


                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={
                    running ||
                    submitting
                  }
                >
                  {submitting
                    ? 'Submitting...'
                    : '✓ Submit'}
                </Button>

              </div>

            </div>


            <div className="monaco-wrapper">

              <Editor
                height="480px"
                language={
                  language === 'cpp'
                    ? 'cpp'
                    : language
                }
                theme="vs-dark"
                value={code}
                onChange={value =>
                  setCode(value || '')
                }
                options={{
                  minimap: {
                    enabled: false
                  },

                  automaticLayout: true,

                  fontSize: 14,

                  lineHeight: 21,

                  tabSize: 4,

                  wordWrap: 'on',

                  scrollBeyondLastLine: false,

                  padding: {
                    top: 12,
                    bottom: 12
                  },

                  smoothScrolling: true,

                  cursorSmoothCaretAnimation: 'on',

                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8
                  }
                }}
              />

            </div>

          </Card>



          {/* CUSTOM INPUT */}

          <Card className="input-card">

            <div className="input-header">

              <div>

                <h3>
                  Custom Input
                </h3>

                <span>
                  Optional
                </span>

              </div>

              <button
                className="clear-input"
                onClick={() =>
                  setCustomInput('')
                }
              >
                Clear
              </button>

            </div>


            <textarea
              className="custom-input-area"
              value={customInput}
              onChange={e =>
                setCustomInput(
                  e.target.value
                )
              }
              placeholder={
                examples.length > 0
                  ? `Example input:\n${examples[0].input || ''}`
                  : 'Enter custom input...'
              }
            />

          </Card>



          {/* RESULT */}

          {result && (

            <Card className="result-card">

              <div className="result-top">

                <div
                  className={
                    result.type === 'success'
                      ? 'result-title success'
                      : result.type === 'info'
                        ? 'result-title info'
                        : 'result-title error'
                  }
                >

                  {result.type === 'success'
                    ? '✓'
                    : result.type === 'info'
                      ? 'i'
                      : '×'}

                  <span>
                    {result.title}
                  </span>

                </div>


                {result.time !== undefined && (

                  <div className="result-stats">

                    <span>
                      Time: {result.time}
                    </span>

                    {result.memory !== undefined && (
                      <span>
                        Memory: {result.memory}
                      </span>
                    )}

                  </div>

                )}

              </div>


              {result.message && (

                <p className="result-message">
                  {result.message}
                </p>

              )}


              {result.stdout && (

                <div className="output-box">

                  <div className="output-label">
                    Output
                  </div>

                  <pre>
                    {result.stdout}
                  </pre>

                </div>

              )}


              {result.stderr && (

                <div className="error-box">

                  <div className="output-label">
                    Error
                  </div>

                  <pre>
                    {result.stderr}
                  </pre>

                </div>

              )}


              {result.outputs?.length > 0 && (

                <div className="test-results">

                  <div className="test-results-title">
                    Test Results
                  </div>


                  {result.outputs.map(
                    (test, index) => (

                      <div
                        className="test-result"
                        key={index}
                      >

                        <div className="test-result-head">

                          <span>
                            Test Case {index + 1}
                          </span>

                          <Badge>
                            {test.status}
                          </Badge>

                        </div>


                        <div className="test-result-content">

                          <div>

                            <small>
                              Input
                            </small>

                            <pre>
                              {test.input}
                            </pre>

                          </div>


                          <div>

                            <small>
                              Output
                            </small>

                            <pre>
                              {test.output}
                            </pre>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </Card>

          )}

        </section>

      </div>

    </div>

  );

};

export default CodingProblem;