import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import corsMiddleware from './src/middleware/corsMiddleware.js';
import { errorHandler, notFound } from './src/middleware/errorMiddleware.js';
import authRoutes from './src/routes/authRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import organizerRoutes from './src/routes/organizerRoutes.js';

connectDB();

const app = express();

// ── Core Middleware ──────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ← required to read req.cookies

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({ success: true, message: 'Server is running.' })
);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizer', organizerRoutes);

// ── Error Handlers (must be last) ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);