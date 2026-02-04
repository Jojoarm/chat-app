import { Router } from 'express';
import {
  authStatusController,
  getUsersController,
  logInUserController,
  logoutController,
  signUpUserController,
} from '../controllers/user.controller';
import { verifyToken } from '../config/auth.config';

const userRoutes = Router()
  .post('/signup', signUpUserController)
  .post('/login', logInUserController)
  .post('/logout', logoutController)
  .use(verifyToken)
  .get('/auth-status', authStatusController)
  .get('/', getUsersController);

export default userRoutes;
