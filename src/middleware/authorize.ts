import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export function authorize(...roles: Array<'user' | 'admin'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(new ApiError(401, 'Authentication required'));
    }
    if (!roles.includes(req.auth.role)) {
      return next(new ApiError(403, 'You are not authorized to access this resource'));
    }
    return next();
  };
}
