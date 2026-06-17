import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getOrganizerDashboardStats,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  getEventAttendees,
  checkInAttendee,
  sendEventAnnouncement,
  getOrganizerAnalytics
} from '../controllers/organizerController.js';
import express from 'express';

const router = express.Router();

// All routes here are protected and restricted to organizers
router.use(protect);
router.use(authorize('organizer', 'admin'));

router.get('/stats', getOrganizerDashboardStats);
router.get('/events', getOrganizerEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);

router.get('/events/:id/attendees', getEventAttendees);
router.post('/registrations/:id/check-in', checkInAttendee);
router.post('/events/:id/announcements', sendEventAnnouncement);

router.get('/analytics', getOrganizerAnalytics);

export default router;
