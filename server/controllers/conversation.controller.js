const { z } = require('zod');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { emitToUser } = require('../sockets/registry');

const createSchema = z.object({ otherUserId: z.string().length(24) });
const sendSchema = z.object({ content: z.string().trim().min(1).max(4000) });

exports.listMine = asyncHandler(async (req, res) => {
  const items = await Conversation.find({ participants: req.user.id })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });
  res.json(items);
});

exports.create = asyncHandler(async (req, res) => {
  const { otherUserId } = createSchema.parse(req.body);
  if (otherUserId === req.user.id) return res.status(400).json({ error: 'Self conversation not allowed' });
  const other = await User.findById(otherUserId);
  if (!other) return res.status(404).json({ error: 'User not found' });

  let convo = await Conversation.findOne({
    participants: { $all: [req.user.id, otherUserId], $size: 2 },
  });
  if (!convo) {
    convo = await Conversation.create({ participants: [req.user.id, otherUserId] });
  }
  await convo.populate('participants', 'name avatar');
  res.status(201).json(convo);
});

function assertParticipant(convo, userId) {
  if (!convo) {
    const e = new Error('Conversation not found');
    e.status = 404;
    throw e;
  }
  if (!convo.participants.map(String).includes(userId)) {
    const e = new Error('Forbidden');
    e.status = 403;
    throw e;
  }
}

exports.listMessages = asyncHandler(async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  assertParticipant(convo, req.user.id);
  const messages = await Message.find({ conversation: convo._id }).sort({ createdAt: 1 }).limit(500);
  res.json(messages);
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { content } = sendSchema.parse(req.body);
  const convo = await Conversation.findById(req.params.id);
  assertParticipant(convo, req.user.id);
  const receiver = convo.participants.find((p) => String(p) !== req.user.id);
  const msg = await Message.create({
    conversation: convo._id,
    sender: req.user.id,
    receiver,
    content,
  });
  convo.lastMessage = msg._id;
  convo.lastMessageAt = new Date();
  await convo.save();

  // realtime emit
  emitToUser(String(receiver), 'chat:new', msg);
  emitToUser(req.user.id, 'chat:new', msg);

  // notification
  const sender = await User.findById(req.user.id);
  const notif = await Notification.create({
    recipient: receiver,
    actor: req.user.id,
    type: 'new_message',
    message: `${sender.name}: ${content.slice(0, 80)}`,
    link: `/chat/${convo._id}`,
  });
  emitToUser(String(receiver), 'notify:new', notif);

  res.status(201).json(msg);
});

exports.markRead = asyncHandler(async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  assertParticipant(convo, req.user.id);
  await Message.updateMany(
    { conversation: convo._id, receiver: req.user.id, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
  const otherId = convo.participants.map(String).find((p) => p !== req.user.id);
  emitToUser(otherId, 'chat:read', { conversationId: String(convo._id), by: req.user.id });
  res.json({ ok: true });
});
