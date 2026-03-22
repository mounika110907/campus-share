const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, default: 'Good' },
    availability: { type: Boolean, default: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);