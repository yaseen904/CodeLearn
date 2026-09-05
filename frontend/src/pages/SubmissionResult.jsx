import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

const SubmissionResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/submissions`);
      const found = response.data.find(s => s._id === id);
      setSubmission(found);
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading submission result..." />;
  }

  return (
    <div className="submission-result-page">
      <div className="submission-header">
        <h1>Submission Result</h1>
        <Button onClick={() => navigate('/practice')} variant="outline">
          Back to Practice
        </Button>
      </div>

      <Card className="submission-card">
        <div className="submission-content">
          <div className={`submission-status ${submission?.status === 'Accepted' ? 'success' : 'error'}`}>
            {submission?.status}
          </div>

          <div className="submission-details">
            <div className="detail-row">
              <span className="detail-label">Problem:</span>
              <span className="detail-value">{submission?.problemId?.title}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Language:</span>
              <span className="detail-value">{submission?.language}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Runtime:</span>
              <span className="detail-value">{submission?.runtime}ms</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Memory:</span>
              <span className="detail-value">{submission?.memory}MB</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Submitted:</span>
              <span className="detail-value">
                {new Date(submission?.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="submission-actions">
            <Button onClick={() => navigate(`/problem/${submission?.problemId?._id}`)} variant="primary">
              Try Again
            </Button>
            <Button onClick={() => navigate('/practice')} variant="secondary">
              Next Problem
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubmissionResult;
