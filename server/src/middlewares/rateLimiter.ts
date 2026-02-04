import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import type { Options as RateLimitOptions } from 'express-rate-limit';
import logger from '../utils/logger';

const handleRateLimit = (
  req: Request,
  res: Response,
  _next: NextFunction,
  options: RateLimitOptions,
) => {
  const message =
    (options.message as string) ||
    'Too many requests. Please wait and try again later.';

  logger.warn(
    `Rate limit hit for IP: ${req.ip} on ${req.method} ${req.originalUrl}`,
  );

  res.status(429).json({
    success: false,
    message,
    limit: options.max,
    retryAfter: Math.ceil((options.windowMs || 0) / 1000 / 60), // in minutes
  });
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
  handler: handleRateLimit,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) =>
    handleRateLimit(req, res, next, {
      ...options,
      message: 'Too many failed login attempts. Try again in 15 minutes.',
    }),
});

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) =>
    handleRateLimit(req, res, next, {
      ...options,
      message: 'Too many signups from this IP. Please try again later.',
    }),
});
