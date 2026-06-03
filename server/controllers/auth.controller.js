const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email().max(120),
    password: z
      .string()
      .min(8)
      .max(72)
      .regex(/[A-Z]/, 'Need uppercase')
      .regex(/[a-z]/, 'Need lowercase')
      .regex(/\d/, 'Need digit'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

async function issueTokens(user) {
  const access = signAccess({ sub: user.id });
  const refresh = signRefresh({ sub: user.id });
  user.refreshTokenHash = await bcrypt.hash(refresh, 10);
  await user.save();
  return { access, refresh };
}

exports.register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const exists = await User.findOne({ email: data.email });
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });
  const tokens = await issueTokens(user);
  res.status(201).json({ user: user.toPublic(), ...tokens });
});

exports.login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await user.comparePassword(data.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const tokens = await issueTokens(user);
  res.json({ user: user.toPublic(), ...tokens });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  let decoded;
  try {
    decoded = verifyRefresh(refreshToken);
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  const user = await User.findById(decoded.sub).select('+refreshTokenHash');
  if (!user || !user.refreshTokenHash) return res.status(401).json({ error: 'Session revoked' });
  const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!ok) return res.status(401).json({ error: 'Invalid refresh token' });
  const tokens = await issueTokens(user); // rotation
  res.json(tokens);
});

exports.logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, { refreshTokenHash: null });
  }
  res.json({ ok: true });
});
