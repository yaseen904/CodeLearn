import { useState, useEffect } from 'react';

const QuizTimer = ({ totalTime, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, totalTime, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="quiz-timer">
      <span className="timer-icon">⏱️</span>
      <span className="timer-time">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default QuizTimer;
