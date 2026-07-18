const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect); // all task routes require authentication

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority'),
  body('status').optional().isIn(['Pending', 'Completed']).withMessage('Invalid status'),
  body('due_date').optional({ nullable: true, checkFalsy: true }),
];

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', taskValidation, validate, createTask);
router.put('/:id', taskValidation, validate, updateTask);
router.delete('/:id', deleteTask);
router.patch(
  '/:id/status',
  [body('status').isIn(['Pending', 'Completed']).withMessage('Invalid status')],
  validate,
  updateTaskStatus
);

module.exports = router;
