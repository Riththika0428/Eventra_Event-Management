import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ticketType: {
      name: String,
      price: Number
    },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    attendanceStatus: {
      type: String,
      enum: ['Registered', 'CheckedIn', 'NoShow'],
      default: 'Registered'
    },
    checkInTime: { type: Date },
    qrCode: { type: String }, // Store QR Code data/string
    registrationDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, user: 1 }, { unique: true });
registrationSchema.index({ qrCode: 1 });

export default mongoose.model('Registration', registrationSchema);
