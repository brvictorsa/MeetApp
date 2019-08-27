import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

// verifica se o usuário está logado através do tokem
export default async (req, res, next) => {
  // recupera o header
  const authHeader = req.headers.authorization;

  // verifica header
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // valida o token
  const [, token] = authHeader.split(' ');

  try {
    // decode do token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // adiciona o id na requisição
    req.userId = decoded.id;
    // chama a próxima função de middleware no ciclo de solicitação/resposta
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
