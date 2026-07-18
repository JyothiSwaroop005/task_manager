const { validationResult } = require('express-validator');

// Runs after express-validator chains; returns 400 with details if validation fails
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = validate;
