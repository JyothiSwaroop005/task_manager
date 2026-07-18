import { useState, useEffect, useCallback, useMemo } from 'react';
import taskService from '../services/taskService';
import useSocket from './useSocket';
import useToast from './useToast';

// Central data hook for the Tasks/Dashboard pages: fetches tasks + stats,
// wires up live socket updates, and exposes search/filter/sort state.
export default function useTasks() {
  const { socket } = useSocket();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.getTasks({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sortBy,
      });
      setTasks(res.data.tasks);
      setStats(res.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(fetchTasks, 250); // debounce search typing
    return () => clearTimeout(timeout);
  }, [fetchTasks]);

  // Live updates: re-sync from the server whenever any client mutates a task
  useEffect(() => {
    if (!socket) return;

    const refresh = (label) => () => {
      fetchTasks();
      if (label) showToast(label, 'info');
    };

    socket.on('task:created', refresh('A task was added'));
    socket.on('task:updated', refresh());
    socket.on('task:deleted', refresh());
    socket.on('task:statusUpdated', refresh());

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.off('task:statusUpdated');
    };
  }, [socket, fetchTasks, showToast]);

  const createTask = useCallback(
    async (payload) => {
      const res = await taskService.createTask(payload);
      showToast('Task created', 'success');
      fetchTasks();
      return res;
    },
    [fetchTasks, showToast]
  );

  const editTask = useCallback(
    async (id, payload) => {
      const res = await taskService.updateTask(id, payload);
      showToast('Task updated', 'success');
      fetchTasks();
      return res;
    },
    [fetchTasks, showToast]
  );

  const removeTask = useCallback(
    async (id) => {
      await taskService.deleteTask(id);
      showToast('Task deleted', 'success');
      fetchTasks();
    },
    [fetchTasks, showToast]
  );

  const toggleStatus = useCallback(
    async (task) => {
      const next = task.status === 'Completed' ? 'Pending' : 'Completed';
      await taskService.updateStatus(task.id, next);
      fetchTasks();
    },
    [fetchTasks]
  );

  const completionPercent = useMemo(() => {
    if (!stats.total) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  return {
    tasks,
    stats,
    completionPercent,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    createTask,
    editTask,
    removeTask,
    toggleStatus,
    refetch: fetchTasks,
  };
}
