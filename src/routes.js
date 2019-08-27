import { Router } from 'express';

const routes = new Router();

// welcome route
// routes.get('/', (req, res) => {
//   return res.json({ message: 'Meetapp application says hello' });
// });

routes.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  return res.json({ name, email, password });
});

export default routes;
