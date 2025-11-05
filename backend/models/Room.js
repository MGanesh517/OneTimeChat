const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
    default: 'anonymous',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  replyTo: {
    id: String,
    text: String,
    sender: String,
  },
}, { _id: true });

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Auto-delete after 24 hours (optional)
  },
  participants: [{
    socketId: String,
    joinedAt: Date,
  }],
  messages: [MessageSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  participantCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster room lookups
RoomSchema.index({ roomId: 1 });
RoomSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Room', RoomSchema);

