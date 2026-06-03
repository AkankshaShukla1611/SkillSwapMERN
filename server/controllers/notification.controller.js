const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const items = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(items);
});

exports.markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.id },
    { read: true },
    { new: true }
  );
  if (!n) return res.status(404).json({ error: 'Not found' });
  res.json(n);
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
  res.json({ ok: true });
});
