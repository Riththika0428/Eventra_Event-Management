import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Announcement from '../models/Announcement.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get dashboard stats for organizer
// @route   GET /api/organizer/stats
// @access  Private/Organizer
export const getOrganizerDashboardStats = asyncHandler(async (req, res) => {
  const organizerId = req.user._id;

  const events = await Event.find({ organizer: organizerId });
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'Published' || e.status === 'Ongoing').length;
  
  const totalRegistrations = events.reduce((acc, e) => acc + e.totalRegistrations, 0);
  const totalRevenue = events.reduce((acc, e) => acc + e.totalRevenue, 0);
  
  // Recent registrations
  const recentRegistrations = await Registration.find()
    .populate('event', 'title')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  sendSuccess(res, 200, 'Stats fetched successfully', {
    overview: {
      totalEvents,
      activeEvents,
      totalRegistrations,
      totalRevenue,
      ticketsSold: totalRegistrations, // Simplified mapping
      attendanceRate: 0 // Will be calculated in detailed analytics
    },
    recentRegistrations
  });
});

// @desc    Get organizer events
// @route   GET /api/organizer/events
// @access  Private/Organizer
export const getOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
  sendSuccess(res, 200, 'Events fetched successfully', events);
});

// @desc    Create new event
// @route   POST /api/organizer/events
// @access  Private/Organizer
export const createEvent = asyncHandler(async (req, res) => {
  const eventData = {
    ...req.body,
    organizer: req.user._id
  };

  const event = await Event.create(eventData);
  sendSuccess(res, 201, 'Event created successfully', event);
});

// @desc    Update event
// @route   PUT /api/organizer/events/:id
// @access  Private/Organizer
export const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) return sendError(res, 404, 'Event not found');
  if (event.organizer.toString() !== req.user._id.toString()) {
    return sendError(res, 403, 'Not authorized to update this event');
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  sendSuccess(res, 200, 'Event updated successfully', event);
});

// @desc    Get event attendees
// @route   GET /api/organizer/events/:id/attendees
// @access  Private/Organizer
export const getEventAttendees = asyncHandler(async (req, res) => {
  const attendees = await Registration.find({ event: req.params.id })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  
  sendSuccess(res, 200, 'Attendees fetched successfully', attendees);
});

// @desc    Check-in attendee via QR or ID
// @route   POST /api/organizer/registrations/:id/check-in
// @access  Private/Organizer
export const checkInAttendee = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) return sendError(res, 404, 'Registration not found');
  
  if (registration.attendanceStatus === 'CheckedIn') {
    return sendError(res, 400, 'Attendee already checked in');
  }

  registration.attendanceStatus = 'CheckedIn';
  registration.checkInTime = new Date();
  await registration.save();

  // Update event attendance count
  await Event.findByIdAndUpdate(registration.event, {
    $inc: { attendanceCount: 1 }
  });

  sendSuccess(res, 200, 'Attendee checked in successfully', registration);
});

// @desc    Send event announcement
// @route   POST /api/organizer/events/:id/announcements
// @access  Private/Organizer
export const sendEventAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({
    ...req.body,
    event: req.params.id
  });

  // Here you would integrate with SendGrid/Resend/etc.
  // For now, we just save it to DB
  
  sendSuccess(res, 201, 'Announcement sent successfully', announcement);
});

// @desc    Get detailed analytics for organizer
// @route   GET /api/organizer/analytics
// @access  Private/Organizer
export const getOrganizerAnalytics = asyncHandler(async (req, res) => {
  const organizerId = req.user._id;
  const events = await Event.find({ organizer: organizerId });

  // Mock data for registration trends (to be replaced with real aggregation)
  const registrationTrends = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 22 },
    { name: 'Fri', count: 30 },
    { name: 'Sat', count: 25 },
    { name: 'Sun', count: 18 }
  ];

  const categoryBreakdown = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  sendSuccess(res, 200, 'Analytics fetched successfully', {
    registrationTrends,
    categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
    revenueByEvent: events.map(e => ({ name: e.title, revenue: e.totalRevenue }))
  });
});
