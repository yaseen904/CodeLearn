import { Link } from 'react-router-dom';
import Badge from './Badge';

const ProblemCard = ({ problem }) => {
  const difficultyColors = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'danger'
  };

  return (
    <div className="problem-card">
      <div className="problem-card-header">
        <h4 className="problem-card-title">{problem.title}</h4>
        <Badge variant={difficultyColors[problem.difficulty]}>
          {problem.difficulty}
        </Badge>
      </div>
      <div className="problem-card-body">
        <div className="problem-card-topic">{problem.topic}</div>
        <div className="problem-card-stats">
          <span>Acceptance: {Math.floor(Math.random() * 30) + 40}%</span>
        </div>
      </div>
      <div className="problem-card-footer">
        <Link to={`/problem/${problem._id}`} className="btn btn-primary btn-sm">
          Solve
        </Link>
      </div>
    </div>
  );
};

export default ProblemCard;
