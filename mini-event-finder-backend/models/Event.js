const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please add max participants'],
      min: [1, 'Max participants must be at least 1'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: [0, 'Current participants cannot be negative'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to check if event is full
eventSchema.methods.isFull = function () {
  return this.currentParticipants >= this.maxParticipants;
};

module.exports = mongoose.model('Event', eventSchema);