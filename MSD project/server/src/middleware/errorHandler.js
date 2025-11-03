// Centralised Express error handler so all controllers can throw Errors
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('[API Error]', {
      message,
      status,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {}),
  });

  next();
};

export default errorHandler;
