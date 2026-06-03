const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending', index: true },
  },
  { timestamps: true }
);

ConnectionRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
