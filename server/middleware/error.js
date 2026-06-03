const { ZodError } = require('zod');

function notFound(req, res, _next) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}
function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', issues: err.issues });
  }
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
}
module.exports = { notFound, errorHandler };
