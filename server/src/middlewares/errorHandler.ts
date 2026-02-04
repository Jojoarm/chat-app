import { ErrorRequestHandler } from 'express';
import { HTTPSTATUS } from '../config/http.config';
import { AppError, ErrorCodes } from '../utils/app-error';
import logger from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
): any => {
  logger.error(`Error occurred: ${req.path}`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    });
  }

  // Don't leak error details in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : error?.message || 'Something went wrong';

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message,
    errorCode: ErrorCodes.ERR_INTERNAL,
    ...(process.env.NODE_ENV !== 'production' && { stack: error?.stack }),
  });
};
