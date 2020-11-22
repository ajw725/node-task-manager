import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IUserDocument, User, UserTokenPayload } from '../models/user.model';

const validateToken = async (token: string): Promise<IUserDocument> => {
  const jwtSecret = process.env.JWT_SECRET || '';
  const decoded = <UserTokenPayload>verify(token, jwtSecret);
  const user = await User.findOne({
    _id: decoded._id,
    'tokens.token': token,
  });

  if (!user) {
    throw new Error('No user found');
  }

  return user;
};

export const authorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, path } = req;
  const skipAuth =
    method === 'POST' && (path === '/login' || path === '/users');

  if (skipAuth) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const user = await validateToken(token);
    req.user = user;
    req.token = token;
  } catch (err) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  next();
};
