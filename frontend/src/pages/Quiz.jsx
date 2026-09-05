import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MCQCard from '../components/MCQCard';
import QuizTimer from '../components/QuizTimer';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import api from '../services/api';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions: initialQuestions, config } = location.state || { questions: [], config: {} };
  
  const [questions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialQuestions.length * 60);

  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-page">
        <Card className="error-card">
          <h2>No questions available</h2>
          <Button onClick={() => navigate('/mcq')} variant="primary">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const handleStart = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    setQuizFinished(true);

    const quizData = questions.map((q, index) => ({
      questionId: q._id,
      selectedAnswer: answers[index],
      isCorrect: answers[index] === q.correctAnswer
    }));

    const correctAnswers = quizData.filter(q => q.isCorrect).length;
    const score = correctAnswers;
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const timeTaken = (questions.length * 60) - timeLeft;

    try {
      const response = await api.post('/quizzes', {
        topic: config.topic || 'Mixed',
        difficulty: config.difficulty || 'Mixed',
        questions: quizData,
        score,
        totalQuestions: questions.length,
        accuracy,
        timeTaken
      });

      navigate(`/quiz-result/${response.data._id}`, {
        state: {
          quizData,
          score,
          accuracy,
          timeTaken,
          questions
        }
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      navigate(`/quiz-result/temp`, {
        state: {
          quizData,
          score,
          accuracy,
          timeTaken,
          questions
        }
      });
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = ((answeredCount / questions.length) * 100).toFixed(0);

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <Card className="quiz-start-card">
          <h2>Ready to Start?</h2>
          <div className="quiz-summary">
            <p><strong>Topic:</strong> {config.topic || 'Mixed'}</p>
            <p><strong>Difficulty:</strong> {config.difficulty || 'Mixed'}</p>
            <p><strong>Questions:</strong> {questions.length}</p>
            <p><strong>Time Limit:</strong> {questions.length} minutes</p>
          </div>
          <Button onClick={handleStart} variant="primary" size="lg">
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div className="quiz-info">
          <h2>Question {currentQuestion + 1} of {questions.length}</h2>
          <Badge variant="info">{config.topic || 'Mixed'}</Badge>
        </div>
        <QuizTimer
          totalTime={timeLeft}
          onTimeUp={handleTimeUp}
          isActive={!quizFinished}
        />
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">{answeredCount}/{questions.length} answered</span>
      </div>

      <div className="quiz-content">
        <MCQCard
          question={questions[currentQuestion]}
          selectedAnswer={answers[currentQuestion]}
          onSelect={(answerIndex) => handleAnswer(currentQuestion, answerIndex)}
          showResult={false}
        />
      </div>

      <div className="quiz-navigation">
        <Button
          onClick={handlePrevious}
          variant="secondary"
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="question-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-dot ${index === currentQuestion ? 'active' : ''} ${answers[index] !== undefined ? 'answered' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={answeredCount === 0}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="primary"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
