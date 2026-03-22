const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'returned'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);