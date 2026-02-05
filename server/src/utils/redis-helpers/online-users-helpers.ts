import redisClient from '../../config/redis-client.config';
import logger from '../logger';

const ONLINE_PREFIX = 'online:';
const ONLINE_TTL = 60 * 5; //5 minutes - refresh on each activity

//Mark user as online
export const setUserOnline = async (userId: string, socketId: string) => {
  try {
    await redisClient.setex(`${ONLINE_PREFIX}${userId}`, ONLINE_TTL, socketId);
  } catch (error) {
    logger.error(`Error setting user with ${userId} online`, error);
  }
};

//Get socketId for a user
export const getUserSocketId = async (
  userId: string,
): Promise<string | null> => {
  try {
    return await redisClient.get(`${ONLINE_PREFIX}${userId}`);
  } catch (error) {
    logger.error(`Error getting user socket id for ${userId}`, error);
    return null;
  }
};

//Remove user from online list
export const setUserOffline = async (userId: string) => {
  try {
    await redisClient.del(`${ONLINE_PREFIX}${userId}`);
  } catch (error) {
    logger.error(`Error setting user ${userId} offline`, error);
  }
};

//check if user is online
export const isUserOnline = async (userId: string): Promise<boolean> => {
  try {
    return !!(await redisClient.exists(`${ONLINE_PREFIX}${userId}`));
  } catch (error) {
    logger.error(`Error determining if user is online`, error);
    return false;
  }
};

//get all online user ids
export const getAllOnlineUsers = async (): Promise<string[]> => {
  try {
    const keys = await redisClient.keys(`${ONLINE_PREFIX}*`);
    // Remove the prefix to get just the userIds
    return keys.map((key) => key.replace(ONLINE_PREFIX, ''));
  } catch (error) {
    logger.error('Redis getAllOnlineUsers error:', error);
    return [];
  }
};

// Keep user's session alive (call this periodically or on activity)
export const refreshUserOnline = async (userId: string, socketId: string) => {
  try {
    await redisClient.expire(`${ONLINE_PREFIX}${userId}`, ONLINE_TTL);
  } catch (error) {
    logger.error(`Redis refreshUserOnline error for ${userId}:`, error);
  }
};
