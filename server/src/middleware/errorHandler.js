const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url} ->`, err);

  // Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      data: null,
      error: 'Validation failed',
      details: formattedErrors
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid or expired token. Please sign in again.'
    });
  }

  // Prisma Known Request Errors
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'unique field';
    return res.status(409).json({
      success: false,
      data: null,
      error: `Conflict: A record with that ${target} already exists.`
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      data: null,
      error: 'Resource not found'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
