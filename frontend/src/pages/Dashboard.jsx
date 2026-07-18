import { useMemo } from 'react';
import { FiCheckSquare, FiClock, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = total - completed;
    const high = tasks.filter((t) => t.priority === 'High').length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, high, percentage };
  }, [tasks]);

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [tasks]
  );

  const upcomingDeadlines = useMemo(
    () =>
      tasks
        .filter((t) => t.due_date && t.status !== 'Completed')
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5),
    [tasks]
  );

  if (loading) return <Layout><Spinner fullScreen /></Layout>;

  return (
    <Layout>
      <h1 className="page-title">Welcome back, {user?.username} 👋</h1>

      <div className="stats-grid">
        <StatCard icon={<FiCheckSquare />} label="Total Tasks" value={stats.total} colorClass="stat-blue" />
        <StatCard icon={<FiTrendingUp />} label="Completed" value={stats.completed} colorClass="stat-green" />
        <StatCard icon={<FiClock />} label="Pending" value={stats.pending} colorClass="stat-orange" />
        <StatCard icon={<FiAlertTriangle />} label="High Priority" value={stats.high} colorClass="stat-red" />
      </div>

      <div className="card">
        <h2 className="card-title">Completion Progress</h2>
        <ProgressBar percentage={stats.percentage} />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="card-title">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <EmptyState message="No tasks yet" />
          ) : (
            <ul className="simple-list">
              {recentTasks.map((t) => (
                <li key={t.id}>
                  <span>{t.title}</span>
                  <div className="simple-list-badges">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">Upcoming Deadlines</h2>
          {upcomingDeadlines.length === 0 ? (
            <EmptyState message="No upcoming deadlines" />
          ) : (
            <ul className="simple-list">
              {upcomingDeadlines.map((t) => (
                <li key={t.id}>
                  <span>{t.title}</span>
                  <span className="deadline-date">
                    {new Date(t.due_date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
