import Redis from 'ioredis';
import logger from '../utils/logger';
import { NotFoundException } from '../utils/app-error';
import { Env } from './env.config';

const redisUrl = Env.REDIS_URL;

if (!redisUrl) {
  throw new NotFoundException('Missing REDIS_URL in environment variables');
}

let isInitialConnection = true;
let hasConnectedOnce = false;

// Parse Redis URL for better configuration
const redisClient = new Redis(redisUrl, {
  connectTimeout: 10000, // 10 seconds
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    // Exponential backoff with max delay
    const delay = Math.min(times * 100, 3000);

    // Only log after 3rd attempt to reduce noise
    if (times > 3) {
      logger.warn(`Redis reconnecting... attempt ${times}`);
    }

    return delay;
  },

  // TLS configuration for Upstash
  tls: redisUrl.includes('rediss://')
    ? {
        rejectUnauthorized: true,
      }
    : undefined,

  // Prevent multiple connection attempts
  lazyConnect: false,

  // Enable offline queue (queue commands when disconnected)
  enableOfflineQueue: true,

  // Keep connection alive
  keepAlive: 30000, // 30 seconds

  // Add connection name for debugging
  connectionName: 'edity-server',
});

// Connection event handlers
redisClient.on('connect', () => {
  if (isInitialConnection) {
    logger.info(' Redis connected');
    isInitialConnection = false;
    hasConnectedOnce = true;
  }
});

redisClient.on('ready', () => {
  if (!hasConnectedOnce) {
    logger.info('Redis ready');
    hasConnectedOnce = true;
  }
});

redisClient.on('error', (err) => {
  // Suppress connection errors during initial connection
  if (isInitialConnection) {
    // Silently ignore initial connection errors
    return;
  }

  // Only log actual errors after successful connection
  if (hasConnectedOnce) {
    logger.error('Redis error:', {
      message: err.message,
    });
  }
});

redisClient.on('close', () => {
  if (hasConnectedOnce) {
    logger.warn(' Redis connection closed');
  }
});

redisClient.on('reconnecting', () => {
  if (hasConnectedOnce) {
    logger.info(' Redis reconnecting...');
  }
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Closing Redis connection...');
  await redisClient.quit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default redisClient;
