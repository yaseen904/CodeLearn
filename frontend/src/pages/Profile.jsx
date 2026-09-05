import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import LoadingState from '../components/LoadingState';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', {
        name: profileData.name,
        avatar: profileData.avatar
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <Card title="Profile Information" className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-preview">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <Input
                label="Avatar URL"
                name="avatar"
                value={profileData.avatar}
                onChange={handleChange}
                placeholder="Enter avatar image URL"
              />
            </div>

            <Input
              label="Name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Your name"
            />

            <Input
              label="Email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Your email"
              disabled
            />

            <Button onClick={handleSave} variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Card>

          <Card title="Learning Statistics" className="stats-card">
            <div className="profile-stats">
              <StatCard
                title="Problems Solved"
                value={stats?.problemsSolved || 0}
                icon="💻"
              />
              <StatCard
                title="Coding Accuracy"
                value={`${stats?.codingAccuracy || 0}%`}
                icon="🎯"
              />
              <StatCard
                title="Quizzes Taken"
                value={stats?.quizAttempts || 0}
                icon="📝"
              />
              <StatCard
                title="Current Streak"
                value={`${stats?.streak || 0} days`}
                icon="🔥"
              />
            </div>
          </Card>
        </div>

        <div className="profile-sidebar">
          <Card title="Skills & Topics" className="skills-card">
            <div className="skills-list">
              <div className="skill-item">
                <span>Arrays</span>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="skill-item">
                <span>Strings</span>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="skill-item">
                <span>Dynamic Programming</span>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="skill-item">
                <span>Trees</span>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="skill-item">
                <span>Graphs</span>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Account Details" className="account-card">
            <div className="account-info">
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type</span>
                <span className="info-value">Student</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className="info-value">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
