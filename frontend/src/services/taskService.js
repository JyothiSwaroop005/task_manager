import api from './api';

export const taskService = {
  getAll: () => api.get('/tasks').then((res) => res.data),
  getById: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  create: (data) => api.post('/tasks', data).then((res) => res.data),
  update: (id, data) => api.put(`/tasks/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
  updateStatus: (id, status) =>
    api.patch(`/tasks/${id}/status`, { status }).then((res) => res.data),
};
