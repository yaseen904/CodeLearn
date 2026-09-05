import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MCQCard from '../components/MCQCard';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizData, score, accuracy, timeTaken, questions } = location.state || {};

  const [showReview, setShowReview] = useState(false);

  if (!quizData) {
    return (
      <div className="quiz-result-page">
        <Card className="error-card">
          <h2>Quiz result not found</h2>
          <Button onClick={() => navigate('/mcq')} variant="primary">
            Back to MCQ Practice
          </Button>
        </Card>
      </div>
    );
  }

  const correctCount = quizData.filter(q => q.isCorrect).length;
  const incorrectCount = quizData.filter(q => !q.isCorrect && q.selectedAnswer !== undefined).length;
  const unansweredCount = quizData.filter(q => q.selectedAnswer === undefined).length;

  const handleRetry = () => {
    navigate('/mcq');
  };

  const handleReview = () => {
    setShowReview(!showReview);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="quiz-result-page">
      <div className="quiz-result-header">
        <h1>Quiz Results</h1>
        <Button onClick={() => navigate('/mcq')} variant="outline">
          Back to MCQ Practice
        </Button>
      </div>

      <div className="quiz-result-stats">
        <StatCard
          title="Score"
          value={`${score}/${questions.length}`}
          icon="🎯"
        />
        <StatCard
          title="Accuracy"
          value={`${accuracy}%`}
          icon="📊"
        />
        <StatCard
          title="Time Taken"
          value={formatTime(timeTaken)}
          icon="⏱️"
        />
      </div>

      <div className="quiz-result-details">
        <Card title="Performance Breakdown" className="performance-card">
          <div className="performance-grid">
            <div className="performance-item correct">
              <div className="performance-count">{correctCount}</div>
              <div className="performance-label">Correct</div>
            </div>
            <div className="performance-item incorrect">
              <div className="performance-count">{incorrectCount}</div>
              <div className="performance-label">Incorrect</div>
            </div>
            <div className="performance-item unanswered">
              <div className="performance-count">{unansweredCount}</div>
              <div className="performance-label">Unanswered</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="quiz-result-actions">
        <Button onClick={handleRetry} variant="primary">
          Retry Quiz
        </Button>
        <Button onClick={handleReview} variant="secondary">
          {showReview ? 'Hide Review' : 'Review Answers'}
        </Button>
      </div>

      {showReview && (
        <div className="quiz-review">
          <h2>Answer Review</h2>
          {questions.map((question, index) => (
            <MCQCard
              key={index}
              question={question}
              selectedAnswer={quizData[index]?.selectedAnswer}
              onSelect={() => {}}
              showResult={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizResult;
