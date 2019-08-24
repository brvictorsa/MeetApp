import { Router } from 'express';

const routes = new Router();

//welcome route
routes.get('/', (req, res) => {
  return res.json({ message: 'Meetapp application says hello'})
})

export default routes;