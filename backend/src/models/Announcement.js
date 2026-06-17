import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['Update', 'Reminder', 'Change', 'ThankYou'],
      default: 'Update'
    },
    targetAudience: {
      type: String,
      enum: ['All', 'VIP', 'Waitlist'],
      default: 'All'
    },
    sentVia: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

announcementSchema.index({ event: 1 });

export default mongoose.model('Announcement', announcementSchema);
