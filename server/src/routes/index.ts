import { Router } from 'express';
import userRoutes from './user.route';

const routes = Router();

routes.use('/users', userRoutes);

export default routes;
