import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const attachCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,                                    // JS cannot access it
    secure: process.env.NODE_ENV === 'production',    // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,                 // 7 days in ms
  });
};

export default generateToken;