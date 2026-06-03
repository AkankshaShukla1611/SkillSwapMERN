const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    college: { type: String, default: '', maxlength: 120 },
    location: { type: String, default: '', maxlength: 120 },
    teachSkills: { type: [String], default: [], index: true },
    learnSkills: { type: [String], default: [], index: true },
    availability: { type: String, default: '', maxlength: 120 },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    refreshTokenHash: { type: String, default: null, select: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

UserSchema.methods.toPublic = function () {
  const o = this.toObject();
  delete o.password;
  delete o.refreshTokenHash;
  return o;
};

module.exports = mongoose.model('User', UserSchema);
