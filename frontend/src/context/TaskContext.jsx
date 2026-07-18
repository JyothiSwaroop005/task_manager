import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/useToast';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskService.getAll();
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  // Real-time sync: listen for socket events and update local state instantly
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onCreated = (task) => {
      setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]);
      showToast('A task was created', 'info');
    };
    const onUpdated = (task) => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      showToast('A task was updated', 'info');
    };
    const onDeleted = ({ id }) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('A task was deleted', 'info');
    };
    const onStatusUpdated = (task) => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    };

    socket.on('task:created', onCreated);
    socket.on('task:updated', onUpdated);
    socket.on('task:deleted', onDeleted);
    socket.on('task:statusUpdated', onStatusUpdated);

    return () => {
      socket.off('task:created', onCreated);
      socket.off('task:updated', onUpdated);
      socket.off('task:deleted', onDeleted);
      socket.off('task:statusUpdated', onStatusUpdated);
    };
  }, [showToast]);

  const createTask = async (data) => {
    const res = await taskService.create(data);
    setTasks((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateTask = async (id, data) => {
    const res = await taskService.update(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  };

  const deleteTask = async (id) => {
    await taskService.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateStatus = async (id, status) => {
    const res = await taskService.updateStatus(id, status);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, fetchTasks, createTask, updateTask, deleteTask, updateStatus }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
