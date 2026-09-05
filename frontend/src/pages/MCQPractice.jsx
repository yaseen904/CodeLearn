import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from '../components/Select';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

const topics = [
  { value: '', label: 'Select Topic' },
  { value: 'Programming Fundamentals', label: 'Programming Fundamentals' },
  { value: 'Java', label: 'Java' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Python', label: 'Python' },
  { value: 'C++', label: 'C++' },
  { value: 'Data Structures', label: 'Data Structures' },
  { value: 'Algorithms', label: 'Algorithms' },
  { value: 'DBMS', label: 'DBMS' },
  { value: 'SQL', label: 'SQL' },
  { value: 'OOP', label: 'OOP' },
  { value: 'Operating Systems', label: 'Operating Systems' },
  { value: 'Computer Networks', label: 'Computer Networks' },
  { value: 'custom', label: 'Custom Topic...' }
];

const difficulties = [
  { value: '', label: 'All Difficulties' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' }
];

const questionCounts = [
  { value: '5', label: '5 Questions' },
  { value: '10', label: '10 Questions' },
  { value: '15', label: '15 Questions' },
  { value: '20', label: '20 Questions' }
];

const MCQPractice = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    topic: '',
    difficulty: '',
    questionCount: '10',
    customTopic: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  

  const handleGenerateWithAI = async () => {
    // Validate required fields for AI generation
    const topicToUse = config.topic === 'custom' ? config.customTopic : config.topic;
    
    if (!topicToUse || topicToUse.trim() === '') {
      alert('Please select or enter a topic for AI generation');
      return;
    }
    if (!config.difficulty) {
      alert('Please select a difficulty for AI generation');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await api.post('/mcqs/generate', {
        topic: topicToUse,
        difficulty: config.difficulty,
        count: parseInt(config.questionCount)
      });

      if (response.data.questions && response.data.questions.length > 0) {
        navigate('/quiz', { state: { questions: response.data.questions, config: { ...config, topic: topicToUse } } });
      } else {
        alert('Failed to generate questions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate questions with AI';
      alert(`AI Generation Error: ${errorMessage}`);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="mcq-practice-page">
      <div className="mcq-header">
        <h1>MCQ Practice</h1>
        <p>Test your knowledge with multiple choice questions</p>
      </div>

      <Card className="mcq-config-card">
        <div className="mcq-config">
          <h2>Configure Your Quiz</h2>
          
          <Select
            label="Topic"
            value={config.topic}
            onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
            options={topics}
          />
          
          {config.topic === 'custom' && (
            <Input
              label="Custom Topic"
              type="text"
              value={config.customTopic}
              onChange={(e) => setConfig(prev => ({ ...prev, customTopic: e.target.value }))}
              placeholder="Enter your custom topic (e.g., 'React Hooks', 'Machine Learning')"
              required
            />
          )}
          
          <Select
            label="Difficulty"
            value={config.difficulty}
            onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
            options={difficulties}
          />
          
          <Select
            label="Number of Questions"
            value={config.questionCount}
            onChange={(e) => setConfig(prev => ({ ...prev, questionCount: e.target.value }))}
            options={questionCounts}
          />

          <div className="quiz-buttons">
  <Button  
    onClick={handleGenerateWithAI}  
    variant="secondary"  
    size="lg"  
    disabled={aiGenerating} 
    className="generate-ai-btn"
  > 
    {aiGenerating ? 'Generating mcqs' : '✨ Generate mcqs'} 
  </Button>
</div>

          <div className="ai-info-note">
            <strong>💡 Tip:</strong> Use "Start Quiz" for pre-made questions from our database. Use "Generate with AI" to create custom questions on any topic using Google Gemini AI.
          </div>
        </div>
      </Card>

      <div className="mcq-info">
        <Card title="Quiz Features" className="info-card">
          <ul className="features-list">
            <li>⏱️ Timed quizzes to simulate real exam conditions</li>
            <li>📊 Instant feedback on your answers</li>
            <li>📈 Detailed explanations for each question</li>
            <li>📝 Track your quiz history and performance</li>
            <li>🎯 Topic-wise and difficulty-wise analysis</li>
            <li>✨ AI-powered question generation (custom topics)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default MCQPractice;
