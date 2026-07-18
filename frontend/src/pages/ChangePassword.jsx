import { useState } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      showToast('Password changed successfully', 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Change Password</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Current Password
            <input
              type="password"
              required
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              required
              minLength={6}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </label>
          <label>
            Confirm New Password
            <input
              type="password"
              required
              minLength={6}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePassword;
