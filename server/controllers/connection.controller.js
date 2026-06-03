const { z } = require('zod');
const ConnectionRequest = require('../models/ConnectionRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { emitToUser } = require('../sockets/registry');

const sendSchema = z.object({ receiverId: z.string().length(24) });
const actSchema = z.object({ action: z.enum(['accept', 'reject']) });

exports.send = asyncHandler(async (req, res) => {
  const { receiverId } = sendSchema.parse(req.body);
  if (receiverId === req.user.id) return res.status(400).json({ error: 'Cannot connect to self' });
  const receiver = await User.findById(receiverId);
  if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

  const existing = await ConnectionRequest.findOne({
    $or: [
      { sender: req.user.id, receiver: receiverId },
      { sender: receiverId, receiver: req.user.id },
    ],
  });
  if (existing) return res.status(409).json({ error: 'Request already exists', request: existing });

  const cr = await ConnectionRequest.create({ sender: req.user.id, receiver: receiverId });
  const me = await User.findById(req.user.id);
  const notif = await Notification.create({
    recipient: receiverId,
    actor: req.user.id,
    type: 'connection_request',
    message: `${me.name} sent you a connection request`,
    link: '/connections',
  });
  emitToUser(receiverId, 'notify:new', notif);
  res.status(201).json(cr);
});

exports.act = asyncHandler(async (req, res) => {
  const { action } = actSchema.parse(req.body);
  const cr = await ConnectionRequest.findById(req.params.id);
  if (!cr) return res.status(404).json({ error: 'Not found' });
  if (String(cr.receiver) !== req.user.id) return res.status(403).json({ error: 'Not yours to act on' });
  if (cr.status !== 'pending') return res.status(400).json({ error: 'Already resolved' });
  cr.status = action === 'accept' ? 'accepted' : 'rejected';
  await cr.save();

  if (action === 'accept') {
    const me = await User.findById(req.user.id);
    const notif = await Notification.create({
      recipient: cr.sender,
      actor: req.user.id,
      type: 'connection_accepted',
      message: `${me.name} accepted your request`,
      link: '/connections',
    });
    emitToUser(String(cr.sender), 'notify:new', notif);
  }
  res.json(cr);
});

exports.list = asyncHandler(async (req, res) => {
  const items = await ConnectionRequest.find({
    $or: [{ sender: req.user.id }, { receiver: req.user.id }],
  })
    .populate('sender', 'name avatar teachSkills')
    .populate('receiver', 'name avatar teachSkills')
    .sort({ createdAt: -1 });
  res.json(items);
});

exports.remove = asyncHandler(async (req, res) => {
  const cr = await ConnectionRequest.findById(req.params.id);
  if (!cr) return res.status(404).json({ error: 'Not found' });
  if (![String(cr.sender), String(cr.receiver)].includes(req.user.id))
    return res.status(403).json({ error: 'Forbidden' });
  await cr.deleteOne();
  res.json({ ok: true });
});
