import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// rotas
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// middleware global
// routes.use(authMiddleware);
routes.get('/users', authMiddleware, UserController.index);
routes.put('/users', authMiddleware, UserController.update);

export default routes;
