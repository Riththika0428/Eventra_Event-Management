import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendError } from '../utils/apiResponse.js';

// ── Protect: verify JWT ──────────────────────────────────────────────────────
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check cookie first, then Authorization header as fallback
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Not authenticated. Please log in.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return sendError(res, 401, 'User belonging to this token no longer exists.');
  }

  req.user = user; // attach user to request
  next();
});

// ── Authorize: role-based access ─────────────────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Role '${req.user.role}' is not allowed to access this route.`
      );
    }
    next();
  };
};