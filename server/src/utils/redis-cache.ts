import redisClient from '../config/redis-client.config';
import logger from './logger';

const DEFAULT_TTL = 60 * 60; // 1 hour default TTL

// Get cache by key
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Redis getCache error for key ${key}:`, error);
    return null;
  }
};

// Set cache with TTL
export const setCache = async (key: string, value: any, ttl = DEFAULT_TTL) => {
  try {
    await redisClient.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error(`Redis setCache error for key ${key}:`, error);
  }
};

// Delete a specific cache key
export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Redis deleteCache error for key ${key}:`, error);
  }
};

// Delete multiple keys by pattern (for invalidation)
export const deleteCacheByPattern = async (pattern: string) => {
  try {
    const stream = redisClient.scanStream({ match: pattern, count: 100 });

    stream.on('data', async (keys: string[]) => {
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    });

    stream.on('error', (err) => {
      logger.error(`Redis scanStream error for pattern ${pattern}:`, err);
    });
  } catch (error) {
    logger.error(`Redis deleteCacheByPattern error:`, error);
  }
};
