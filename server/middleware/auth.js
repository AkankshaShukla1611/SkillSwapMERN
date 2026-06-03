const { verifyAccess } = require('../utils/jwt');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing access token' });
  try {
    const decoded = verifyAccess(token);
    req.user = { id: decoded.sub };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};
