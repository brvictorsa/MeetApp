import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// rotas
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// routes.use(authMiddleware); // middleware global: rotas após exigem autenticação

routes.get('/users', authMiddleware, UserController.index);
routes.put('/users', authMiddleware, UserController.update);

routes.post(
  '/files',
  authMiddleware,
  upload.single('file'),
  FileController.store
);

routes
  .get('/meetups', authMiddleware, MeetupController.index)
  .post('/meetups', authMiddleware, MeetupController.store);

export default routes;
