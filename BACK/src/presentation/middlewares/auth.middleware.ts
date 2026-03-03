import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UnauthorizedError } from '../../domain/errors/custom.error';

export interface AuthRequest extends Request {
  userId?: string;
  businessId?: string;
  role?: string;
}

export class AuthMiddleware {
  static async validateJWT(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token no proporcionado');
      }

      const token = authHeader.split(' ')[1];
      const payload = await JwtAdapter.verifyToken(token);
      if (!payload) {
        throw new UnauthorizedError('Token inválido o expirado');
      }

      req.userId = payload.userId;
      req.businessId = payload.businessId;
      req.role = payload.role;
      next();
    } catch (error) {
      next(error);
    }
  }
}
