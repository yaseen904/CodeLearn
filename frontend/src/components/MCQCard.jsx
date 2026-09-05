const MCQCard = ({ question, selectedAnswer, onSelect, showResult }) => {
  return (
    <div className="mcq-card">
      <div className="mcq-card-header">
        <h4 className="mcq-card-question">{question.question}</h4>
        <div className="mcq-card-meta">
          <span className="mcq-card-topic">{question.topic}</span>
          <span className="mcq-card-difficulty">{question.difficulty}</span>
        </div>
      </div>
      <div className="mcq-card-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`mcq-option ${
              selectedAnswer === index ? 'selected' : ''
            } ${
              showResult
                ? index === question.correctAnswer
                  ? 'correct'
                  : selectedAnswer === index
                  ? 'incorrect'
                  : ''
                : ''
            }`}
            onClick={() => !showResult && onSelect(index)}
            disabled={showResult}
          >
            <span className="mcq-option-label">{String.fromCharCode(65 + index)}.</span>
            <span className="mcq-option-text">{option}</span>
          </button>
        ))}
      </div>
      {showResult && question.explanation && (
        <div className="mcq-card-explanation">
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};

export default MCQCard;
