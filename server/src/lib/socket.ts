import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server, type Socket } from 'socket.io';
import { Env } from '../config/env.config';
import {
  getAllOnlineUsers,
  getUserSocketId,
  setUserOffline,
  setUserOnline,
} from '../utils/redis-helpers/online-users-helpers';
import logger from '../utils/logger';
// import { validateChatParticipant } from '../services/chat.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: Server | null = null;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: Env.FRONTEND_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) return next(new Error('Unauthorized'));

      const cookies = rawCookie.split('; ').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const token = cookies['accessToken'];

      if (!token) return next(new Error('Unauthorized'));

      const decodedToken = jwt.verify(token, Env.JWT_SECRET) as {
        userId: string;
      };
      if (!decodedToken) return next(new Error('Unauthorized'));

      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      next(new Error('Internal server error'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const newSocketId = socket.id;

    if (!socket.userId) {
      socket.disconnect(true);
      return;
    }

    logger.info('socket connected', {
      userId,
      newSocketId,
    });

    // Register socket for the user in Redis
    await setUserOnline(userId, newSocketId);

    // Get all online users from Redis and broadcast
    const onlineUserIds = await getAllOnlineUsers();
    io?.emit('online:users', onlineUserIds);

    // Create personal room for user
    socket.join(`user:${userId}`);

    // Heartbeat every 2 minutes to refresh TTL
    const heartbeatInterval = setInterval(
      async () => {
        await setUserOnline(userId, newSocketId);
        // logger.info(`Heartbeat: keeping user ${userId} online`);
      },
      2 * 60 * 1000,
    ); // 2 minutes

    socket.on(
      'chat:join',
      async (chatId: string, callback?: (err?: string) => void) => {
        try {
          //   await validateChatParticipant(chatId, userId);
          socket.join(`chat:${chatId}`);
          logger.info(`User ${userId} joined room chat:${chatId}`);

          callback?.();
        } catch (error) {
          callback?.('Error joining chat');
        }
      },
    );

    socket.on('chat:leave', (chatId: string) => {
      if (chatId) {
        socket.leave(`chat:${chatId}`);
        logger.info(`User ${userId} left room chat:${chatId}`);
      }
    });

    socket.on('disconnect', async () => {
      clearInterval(heartbeatInterval); // Stop heartbeat when disconnecting

      const currentSocketId = await getUserSocketId(userId);

      // Only remove if this is the current socket
      // (handles case where user has multiple tabs open)
      if (currentSocketId === newSocketId) {
        await setUserOffline(userId);

        const onlineUserIds = await getAllOnlineUsers();
        io?.emit('online:users', onlineUserIds);

        logger.info('socket disconnected', {
          userId,
          newSocketId,
        });
      }
    });
  });
};

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export const emitNewChatToParticpants = (
  participantIds: string[] = [],
  chat: any,
) => {
  const io = getIO();
  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit('chat:new', chat);
  }
};

export const emitNewMessageToChatRoom = async (
  senderId: string,
  chatId: string,
  message: any,
) => {
  const io = getIO();
  const senderSocketId = await getUserSocketId(senderId?.toString());

  logger.info(senderId, 'senderId');
  logger.info(senderSocketId!, 'sender socketid exist');

  if (senderSocketId) {
    io.to(`chat:${chatId}`).except(senderSocketId).emit('message:new', message);
  } else {
    io.to(`chat:${chatId}`).emit('message:new', message);
  }
};

export const emitLastMessageToParticipants = (
  participantIds: string[],
  chatId: string,
  lastMessage: any,
) => {
  const io = getIO();
  const payload = { chatId, lastMessage };

  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit('chat:update', payload);
  }
};

export const emitChatAI = ({
  chatId,
  chunk = null,
  sender,
  done = false,
  message = null,
}: {
  chatId: string;
  chunk?: string | null;
  sender?: any;
  done?: boolean;
  message?: any;
}) => {
  const io = getIO();
  if (chunk?.trim() && !done) {
    io.to(`chat:${chatId}`).emit('chat:ai', {
      chatId,
      chunk,
      done,
      message: null,
      sender,
    });

    return;
  }

  if (done) {
    io.to(`chat:${chatId}`).emit('chat:ai', {
      chatId,
      chunk: null,
      done,
      message,
      sender,
    });

    return;
  }
};
