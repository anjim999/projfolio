// backend/src/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error('Global error handler:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
