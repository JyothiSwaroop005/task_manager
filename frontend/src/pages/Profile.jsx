import { useState } from 'react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authService.updateProfile(form);
      updateUser(res.data);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <h1 className="page-title">My Profile</h1>
      <div className="card profile-card">
        <div className="profile-header">
          <Avatar name={user?.username || '?'} size={72} />
          <div>
            <h2>{user?.username}</h2>
            <p className="text-muted">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
