import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Continue your learning journey</p>
        </div>
        <div className="dashboard-streak">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{dashboardData?.streak || 0}</span>
          <span className="streak-label">day streak</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Problems Solved"
          value={dashboardData?.problemsSolved || 0}
          icon="💻"
          trend={5}
        />
        <StatCard
          title="Coding Accuracy"
          value={`${dashboardData?.codingAccuracy || 0}%`}
          icon="🎯"
          trend={-2}
        />
        <StatCard
          title="Quizzes Taken"
          value={dashboardData?.quizAttempts || 0}
          icon="📝"
          trend={8}
        />
        <StatCard
          title="Quiz Accuracy"
          value={`${Math.round(dashboardData?.avgQuizAccuracy || 0)}%`}
          icon="📊"
          trend={3}
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <Card title="Continue Learning" className="dashboard-card">
            <div className="learning-progress">
              <div className="progress-header">
                <h3>Data Structures & Algorithms</h3>
                <span className="progress-percentage">65%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <div className="progress-stats">
                <span>13/20 problems solved</span>
                <span>~3 hours remaining</span>
              </div>
              <Link to="/practice" className="btn btn-primary">
                Continue Practice
              </Link>
            </div>
          </Card>

          <Card title="Recent Activity" className="dashboard-card">
            <div className="activity-timeline">
              {dashboardData?.recentSubmissions?.slice(0, 3).map((submission, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {submission.status === 'Accepted' ? '✅' : '❌'}
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">{submission.problemId?.title}</div>
                    <div className="activity-meta">
                      <span className="activity-difficulty">{submission.problemId?.difficulty}</span>
                      <span className="activity-time">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!dashboardData?.recentSubmissions || dashboardData.recentSubmissions.length === 0) && (
                <p className="no-activity">No recent activity. Start practicing!</p>
              )}
            </div>
          </Card>
        </div>

        <div className="dashboard-sidebar">
          <Card title="Recommended Practice" className="dashboard-card">
            <div className="recommended-list">
              <div className="recommended-item">
                <h4>Two Sum</h4>
                <Badge variant="success">Easy</Badge>
                <Link to="/practice" className="btn btn-outline btn-sm">
                  Practice
                </Link>
              </div>
              <div className="recommended-item">
                <h4>Valid Parentheses</h4>
                <Badge variant="success">Easy</Badge>
                <Link to="/practice" className="btn btn-outline btn-sm">
                  Practice
                </Link>
              </div>
              <div className="recommended-item">
                <h4>Longest Substring</h4>
                <Badge variant="warning">Medium</Badge>
                <Link to="/practice" className="btn btn-outline btn-sm">
                  Practice
                </Link>
              </div>
            </div>
          </Card>

          <Card title="Daily Challenge" className="dashboard-card daily-challenge">
            <div className="challenge-content">
              <div className="challenge-icon">🏆</div>
              <h3>Maximum Subarray</h3>
              <p>Solve today's challenge to maintain your streak!</p>
              <Badge variant="warning">Medium</Badge>
              <Link to="/practice" className="btn btn-primary">
                Accept Challenge
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
