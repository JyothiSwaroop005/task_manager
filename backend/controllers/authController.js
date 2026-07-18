const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = await UserModel.create({ username, email, hashedPassword });
  const user = await UserModel.findById(userId);
  const token = generateToken(userId);

  res.status(201).json({ success: true, data: { user, token } });
});

// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user.id);
  delete user.password;

  res.status(200).json({ success: true, data: { user, token } });
});

// @route  POST /api/auth/logout
// Stateless JWT - logout is handled client-side by discarding the token.
// Endpoint exists for API completeness / future blacklist support.
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @route  GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

// @route  PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const updatedUser = await UserModel.updateProfile(req.user.id, { username, email });
  res.status(200).json({ success: true, data: updatedUser });
});

// @route  PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await UserModel.findByEmail(req.user.email);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await UserModel.updatePassword(req.user.id, hashedPassword);

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

module.exports = { register, login, logout, getProfile, updateProfile, changePassword };
