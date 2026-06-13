import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date:        { type: Date, required: true },
    location:    { type: String, required: true },
    capacity:    { type: Number, required: true, min: 1 },
    price:       { type: Number, default: 0 },
    category:    { type: String, enum: ['conference', 'workshop', 'meetup', 'concert', 'other'], default: 'other' },
    organizer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image:       { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1, category: 1 });

export default mongoose.model('Event', eventSchema);