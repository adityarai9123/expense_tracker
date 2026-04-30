/**
 * Global error handler middleware
 * Must be registered LAST in Express app (after all routes)
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} — ${err.message}`);
  if (err.stack) console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, errors });
  }

  // Mongoose duplicate key error (e.g., idempotencyKey conflict)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry. This record already exists.',
    });
  }

  // Mongoose CastError (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: `Invalid value for field: ${err.path}` });
  }

  // JSON parse error (malformed request body)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body' });
  }

  // Default: 500 Internal Server Error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
