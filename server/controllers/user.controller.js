const { z } = require('zod');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { uploadBuffer } = require('../services/cloudinary.service');

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  bio: z.string().max(500).optional(),
  college: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  availability: z.string().max(120).optional(),
  teachSkills: z.array(z.string().min(1).max(40)).max(30).optional(),
  learnSkills: z.array(z.string().min(1).max(40)).max(30).optional(),
  socialLinks: z
    .object({
      github: z.string().url().or(z.literal('')).optional(),
      linkedin: z.string().url().or(z.literal('')).optional(),
      twitter: z.string().url().or(z.literal('')).optional(),
      website: z.string().url().or(z.literal('')).optional(),
    })
    .optional(),
});

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user.toPublic());
});

exports.updateMe = asyncHandler(async (req, res) => {
  const patch = updateSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.user.id, patch, { new: true });
  res.json(user.toPublic());
});

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const result = await uploadBuffer(req.file.buffer);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: result.secure_url },
    { new: true }
  );
  res.json({ avatar: user.avatar });
});

exports.list = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const users = await User.find({ _id: { $ne: req.user.id } })
    .limit(limit)
    .sort({ createdAt: -1 });
  res.json(users.map((u) => u.toPublic()));
});

exports.search = asyncHandler(async (req, res) => {
  const { skill, location, availability, q } = req.query;
  const filter = { _id: { $ne: req.user.id } };
  if (skill) {
    const rx = new RegExp(String(skill), 'i');
    filter.$or = [{ teachSkills: rx }, { learnSkills: rx }];
  }
  if (location) filter.location = new RegExp(String(location), 'i');
  if (availability) filter.availability = new RegExp(String(availability), 'i');
  if (q) {
    const rx = new RegExp(String(q), 'i');
    filter.$or = (filter.$or || []).concat([{ name: rx }, { bio: rx }]);
  }
  const users = await User.find(filter).limit(100);
  res.json(users.map((u) => u.toPublic()));
});

exports.getById = asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json(u.toPublic());
});
