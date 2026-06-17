import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Conference', 'Concert', 'Workshop', 'Webinar', 'Sports',
        'Exhibition', 'Meetup', 'Festival', 'Networking', 'Training',
        'Seminar', 'Custom'
      ],
      default: 'Meetup'
    },
    tags: [String],
    
    // Date & Time
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    timezone: { type: String, default: 'UTC' },
    
    // Location
    isOnline: { type: Boolean, default: false },
    venueName: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    meetingLink: { type: String },
    
    // Media
    bannerImage: { type: String },
    thumbnailImage: { type: String },
    gallery: [String],
    
    // Capacity
    maxCapacity: { type: Number, required: true, min: 1 },
    registrationDeadline: { type: Date },
    waitlistEnabled: { type: Boolean, default: false },
    
    // Ticketing
    ticketTypes: [
      {
        name: { type: String, required: true },
        price: { type: Number, default: 0 },
        type: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
        quantity: { type: Number, required: true },
        sold: { type: Number, default: 0 },
        salesStart: { type: Date },
        salesEnd: { type: Date },
        benefits: [String]
      }
    ],
    
    // Status
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Draft'
    },
    
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Analytics Snapshots
    totalRevenue: { type: Number, default: 0 },
    totalRegistrations: { type: Number, default: 0 },
    attendanceCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1, category: 1, status: 1 });
eventSchema.index({ organizer: 1 });

export default mongoose.model('Event', eventSchema);