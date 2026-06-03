const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 4000 },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Body and sender are immutable; only `read`/`readAt` may change.
MessageSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() || {};
  const set = update.$set || update;
  const allowed = new Set(['read', 'readAt']);
  for (const k of Object.keys(set)) {
    if (!allowed.has(k)) return next(new Error(`Field "${k}" is immutable on messages`));
  }
  next();
});

module.exports = mongoose.model('Message', MessageSchema);
