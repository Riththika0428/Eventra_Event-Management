import User from '../models/User.js';
import generateToken, { attachCookie } from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

// ── POST /api/auth/register ──────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  const errors = validateRegister(req.body);
  if (errors.length > 0) return sendError(res, 400, errors.join(' '));

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return sendError(res, 409, 'Email already registered.');

  // Create user (password hashed by pre-save hook)
  const user = await User.create({ name, email, password, role });

  // Generate token and attach to cookie
  const token = generateToken(user._id);
  attachCookie(res, token);

  sendSuccess(res, 201, 'Registration successful.', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token, // also return in body for clients that prefer header auth
  });
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const errors = validateLogin(req.body);
  if (errors.length > 0) return sendError(res, 400, errors.join(' '));

  // Find user and explicitly select password (select: false in schema)
  const user = await User.findOne({ email }).select('+password');
  if (!user) return sendError(res, 401, 'Invalid email or password.');

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return sendError(res, 401, 'Invalid email or password.');

  // Generate token and attach to cookie
  const token = generateToken(user._id);
  attachCookie(res, token);

  sendSuccess(res, 200, 'Login successful.', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  });
});

// ── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // immediately expire the cookie
  });

  sendSuccess(res, 200, 'Logged out successfully.');
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  // req.user is already attached by protect middleware
  const user = await User.findById(req.user._id);

  sendSuccess(res, 200, 'User fetched successfully.', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});