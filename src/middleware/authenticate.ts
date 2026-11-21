import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { User, IUser } from '../modules/users/user.model';

export type AuthPayload = {
  id: string;
  role: 'user' | 'admin';
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      user?: IUser;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = header.slice(7);
    let payload: AuthPayload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    } catch {
      throw new ApiError(401, 'Invalid or expired token');
    }

    const user = await User.findById(payload.id);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    // Role always comes from DB — never trust client-supplied role
    req.auth = { id: user.id, role: user.role };
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
