import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Verifica se a requisição tem o header de authorization
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  // Divide o token fornecido 'Bearer {token}'
  const [, token] = authHeader.split(' ');

  try {
    // Verifica se o token é valido
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    // Segue com a requisição
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid!' });
  }
};
