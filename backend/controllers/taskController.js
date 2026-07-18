const TaskModel = require('../models/taskModel');
const asyncHandler = require('../utils/asyncHandler');

// @route  GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await TaskModel.findAll(req.user.id);
  res.status(200).json({ success: true, data: tasks });
});

// @route  GET /api/tasks/:id
const getTaskById = asyncHandler(async (req, res) => {
  const task = await TaskModel.findById(req.params.id, req.user.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.status(200).json({ success: true, data: task });
});

// @route  POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const task = await TaskModel.create(req.user.id, req.body);
  req.io.to(`user_${req.user.id}`).emit('task:created', task);
  res.status(201).json({ success: true, data: task });
});

// @route  PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const existing = await TaskModel.findById(req.params.id, req.user.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  const task = await TaskModel.update(req.params.id, req.user.id, req.body);
  req.io.to(`user_${req.user.id}`).emit('task:updated', task);
  res.status(200).json({ success: true, data: task });
});

// @route  DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const deleted = await TaskModel.delete(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  req.io.to(`user_${req.user.id}`).emit('task:deleted', { id: Number(req.params.id) });
  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

// @route  PATCH /api/tasks/:id/status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const existing = await TaskModel.findById(req.params.id, req.user.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  const task = await TaskModel.updateStatus(req.params.id, req.user.id, status);
  req.io.to(`user_${req.user.id}`).emit('task:statusUpdated', task);
  res.status(200).json({ success: true, data: task });
});

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus };
