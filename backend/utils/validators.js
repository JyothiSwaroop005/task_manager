const { body, validationResult } = require('express-validator');

const registerRules = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

const taskRules = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required (max 255 chars)'),
  body('description').optional({ nullable: true }).isString(),
  body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Priority must be High, Medium, or Low'),
  body('status').optional().isIn(['Pending', 'Completed']).withMessage('Status must be Pending or Completed'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date'),
];

// Runs after the *Rules chains; returns 422 with field-level messages on failure
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { registerRules, loginRules, changePasswordRules, taskRules, validate };
