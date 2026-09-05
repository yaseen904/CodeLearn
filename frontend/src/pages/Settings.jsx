import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../services/api';

const Settings = () => {
  const { logout } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notifications: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferenceChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage('Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <Card title="Change Password" className="settings-card">
            <form onSubmit={handlePasswordSubmit} className="password-form">
              {message && (
                <div className={`settings-message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
              />
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="settings-section">
          <Card title="Preferences" className="settings-card">
            <div className="preferences-form">
              <div className="preference-item">
                <label className="preference-label">Theme</label>
                <select
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferenceChange}
                  className="form-select"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={preferences.notifications}
                    onChange={handlePreferenceChange}
                  />
                  Enable Notifications
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="settings-section">
          <Card title="Account Actions" className="settings-card danger-card">
            <div className="account-actions">
              <p className="warning-text">
                These actions are irreversible. Please be careful.
              </p>
              <Button onClick={handleLogout} variant="danger">
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
