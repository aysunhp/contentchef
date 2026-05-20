const config = require('../config');

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (config.nodeEnv === 'development') {
    console.error(`[Error] ${statusCode} — ${message}`, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
