import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import http from 'http';
import passport from 'passport';
import { Env } from './config/env.config';
import { globalLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import connectDB from './config/database.config';
import logger from './utils/logger';
import routes from './routes';
import { initializeSocket } from './lib/socket';

const app = express();
const server = http.createServer(app);

//socket
initializeSocket(server);

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(globalLimiter);

app.use(passport.initialize());

app.get('/health', (_, res) => res.json({ status: 'health status ok' }));

app.use('/api', routes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(Env.PORT, async () => {
      logger.info(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
