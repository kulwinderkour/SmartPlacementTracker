import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['assignment', 'exam', 'meeting', 'interview', 'deadline', 'event', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  notified: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    default: 'whatsapp-parser',
  },
  originalMessage: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
reminderSchema.index({ dueDate: 1, status: 1 });
reminderSchema.index({ status: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
