import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import OrganizingController from './app/controllers/OrganizingController';
import SubscriptionController from './app/controllers/SubscriptionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// rotas
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware); // middleware global: rotas após exigem autenticação

routes.get('/users', UserController.index).put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes
  .get('/meetups', MeetupController.index)
  .post('/meetups', MeetupController.store)
  .post('/meetups/:meetupId/subscriptions', SubscriptionController.store)
  .put('/meetups/:id', MeetupController.update);

routes.get('/organizing', OrganizingController.index);

export default routes;
