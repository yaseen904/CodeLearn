import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Select from '../components/Select';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../services/api';

const topics = [
  { value: 'Arrays', label: 'Arrays' },
  { value: 'Strings', label: 'Strings' },
  { value: 'HashMap', label: 'HashMap' },
  { value: 'Linked List', label: 'Linked List' },
  { value: 'Stack', label: 'Stack' },
  { value: 'Queue', label: 'Queue' },
  { value: 'Binary Search', label: 'Binary Search' },
  { value: 'Sorting', label: 'Sorting' },
  { value: 'Recursion', label: 'Recursion' },
  { value: 'Dynamic Programming', label: 'Dynamic Programming' },
  { value: 'Trees', label: 'Trees' },
  { value: 'Graphs', label: 'Graphs' }
];

const aiLanguages = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' }
];

const aiDifficulties = [
  { value: '', label: 'Select Difficulty' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' }
];

const CodingPractice = () => {
  const navigate = useNavigate();

  // LeetCode search
  const [leetcodeSearch, setLeetcodeSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // AI Challenge
  const [aiConfig, setAiConfig] = useState({
    language: 'java',
    topic: '',
    difficulty: ''
  });

  const [aiGenerating, setAiGenerating] = useState(false);

  // Handle AI settings
  const handleAIChange = (key, value) => {
    setAiConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Search LeetCode
  const handleLeetCodeSearch = async () => {
    const searchValue = leetcodeSearch.trim();

    if (!searchValue) {
      alert('Please enter a problem name or LeetCode number.');
      return;
    }

    setSearching(true);
    setSearchResults([]);

    try {
      const response = await api.get(
        `/leetcode/search?q=${encodeURIComponent(searchValue)}`
      );

      console.log('LeetCode Results:', response.data);

      setSearchResults(response.data.results || []);

    } catch (error) {
      console.error('LeetCode search error:', error);

      alert(
        error.response?.data?.message ||
        'Failed to search LeetCode problems.'
      );
    } finally {
      setSearching(false);
    }
  };

  // Open LeetCode problem
  const handleSolve = async (problem) => {
    try {
      const response = await api.get(
        `/leetcode/problem/${problem.titleSlug}`
      );

      console.log('LeetCode Problem:', response.data);

      navigate('/coding-problem/ai', {
        state: {
          problem: response.data,
          language: 'java',
          isLeetCode: true
        }
      });

    } catch (error) {
      console.error('Error loading LeetCode problem:', error);

      alert(
        error.response?.data?.message ||
        'Failed to load LeetCode problem.'
      );
    }
  };

  // Generate AI coding problem
  const handleGenerateAI = async () => {
    if (!aiConfig.topic) {
      alert('Please select a topic.');
      return;
    }

    if (!aiConfig.difficulty) {
      alert('Please select a difficulty.');
      return;
    }

    setAiGenerating(true);

    try {
      const response = await api.post('/problems/generate', {
        language: aiConfig.language,
        topic: aiConfig.topic,
        difficulty: aiConfig.difficulty
      });

      console.log('AI Challenge:', response.data);

      navigate('/coding-problem/ai', {
        state: {
          problem: response.data,
          language: aiConfig.language
        }
      });

    } catch (error) {
      console.error('AI generation error:', error);

      alert(
        error.response?.data?.message ||
        'Failed to generate AI challenge.'
      );
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="practice-page">

      {/* Header */}
      <div className="practice-header">
        <h1>Coding Practice</h1>

        <p>
          Solve coding problems and prepare for technical interviews.
        </p>
      </div>


      {/* LeetCode Search */}
      <Card
        title="🔎 Search LeetCode Problems"
        className="leetcode-search-card"
      >

        <p className="ai-challenge-description">
          Search problems by name or LeetCode number.
        </p>

        <div className="leetcode-search-controls">

          <Input
            value={leetcodeSearch}
            onChange={(e) => setLeetcodeSearch(e.target.value)}
            placeholder="Search by problem name or number... e.g. 3Sum or 15"
          />

          <Button
            variant="primary"
            size="lg"
            onClick={handleLeetCodeSearch}
            disabled={searching}
          >
            {searching ? 'Searching...' : '🔍 Search'}
          </Button>

        </div>


        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="leetcode-results">

            <h3>
              Search Results
            </h3>

            {searchResults.map(problem => (
              <div
                key={problem.titleSlug}
                className="leetcode-result-card"
              >

                <div className="leetcode-result-info">

                  <h4>
                    #{problem.frontendQuestionId} {problem.title}
                  </h4>

                  <div className="leetcode-result-meta">

                    <span>
                      {problem.difficulty}
                    </span>

                    {problem.topicTags?.slice(0, 3).map(tag => (
                      <span key={tag.slug}>
                        {tag.name}
                      </span>
                    ))}

                  </div>

                </div>


                <Button
                  variant="primary"
                  onClick={() => handleSolve(problem)}
                >
                  Solve →
                </Button>

              </div>
            ))}

          </div>
        )}


        {/* No Results */}
        {!searching &&
          leetcodeSearch.trim() &&
          searchResults.length === 0 && (
            <div className="leetcode-no-results">
              No LeetCode problems found.
            </div>
          )}

      </Card>


      {/* AI Coding Challenge */}
      <Card
        title="🤖 AI Coding Challenge"
        className="ai-challenge-card"
      >

        <p className="ai-challenge-description">
          Generate a fresh coding problem using AI.
          Choose your programming language, topic and difficulty.
        </p>

        <div className="ai-challenge-controls">

          {/* Language */}
          <Select
            label="Language"
            value={aiConfig.language}
            onChange={(e) =>
              handleAIChange('language', e.target.value)
            }
            options={aiLanguages}
          />


          {/* Topic */}
          <Select
            label="Topic"
            value={aiConfig.topic}
            onChange={(e) =>
              handleAIChange('topic', e.target.value)
            }
            options={topics}
          />


          {/* Difficulty */}
          <Select
            label="Difficulty"
            value={aiConfig.difficulty}
            onChange={(e) =>
              handleAIChange('difficulty', e.target.value)
            }
            options={aiDifficulties}
          />


          {/* Generate */}
          <Button
            onClick={handleGenerateAI}
            variant="primary"
            size="lg"
            disabled={aiGenerating}
          >
            {aiGenerating
              ? 'Generating...'
              : '✨ Generate Challenge'}
          </Button>

        </div>

      </Card>

    </div>
  );
};

export default CodingPractice;