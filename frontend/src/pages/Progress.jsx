import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await api.get('/progress');
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading progress data..." />;
  }

  const topicChartData = Object.entries(progressData?.topicPerformance || {}).map(([topic, data]) => ({
    name: topic,
    solved: data.solved,
    attempted: data.attempted
  }));

  const difficultyChartData = Object.entries(progressData?.difficultyPerformance || {}).map(([difficulty, count]) => ({
    name: difficulty,
    value: count
  }));

  const weeklyChartData = progressData?.weeklyActivity || [];

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>Progress & Analytics</h1>
        <p>Track your learning journey</p>
      </div>

      <div className="progress-stats">
        <StatCard
          title="Problems Solved"
          value={progressData?.totalProblemsSolved || 0}
          icon="💻"
        />
        <StatCard
          title="Total Submissions"
          value={progressData?.totalSubmissions || 0}
          icon="📤"
        />
        <StatCard
          title="Quizzes Completed"
          value={progressData?.totalQuizzes || 0}
          icon="📝"
        />
      </div>

      <div className="progress-charts">
        <Card title="Weekly Activity" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                itemStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="submissions" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Topic Performance" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                itemStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="solved" fill="#10b981" name="Solved" />
              <Bar dataKey="attempted" fill="#6366f1" name="Attempted" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Difficulty Distribution" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                itemStyle={{ color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="progress-recent">
        <Card title="Recent Submissions" className="recent-card">
          <div className="recent-list">
            {progressData?.recentSubmissions?.slice(0, 5).map((submission, index) => (
              <div key={index} className="recent-item">
                <div className="recent-info">
                  <h4>{submission.problemId?.title}</h4>
                  <div className="recent-meta">
                    <Badge variant={submission.status === 'Accepted' ? 'success' : 'danger'}>
                      {submission.status}
                    </Badge>
                    <span className="recent-time">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!progressData?.recentSubmissions || progressData.recentSubmissions.length === 0) && (
              <p className="no-data">No recent submissions</p>
            )}
          </div>
        </Card>

        <Card title="Recent Quizzes" className="recent-card">
          <div className="recent-list">
            {progressData?.recentQuizzes?.slice(0, 5).map((quiz, index) => (
              <div key={index} className="recent-item">
                <div className="recent-info">
                  <h4>{quiz.topic} - {quiz.difficulty}</h4>
                  <div className="recent-meta">
                    <Badge variant="info">{quiz.accuracy}% accuracy</Badge>
                    <span className="recent-time">
                      {new Date(quiz.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!progressData?.recentQuizzes || progressData.recentQuizzes.length === 0) && (
              <p className="no-data">No recent quizzes</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
