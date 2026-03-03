import { Response, NextFunction } from 'express';
import { CustomError } from '../../domain/errors/custom.error';
import { AuthRequest } from './auth.middleware';

export class RoleMiddleware {
  static validateRole(allowedRoles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.role) {
          throw CustomError.forbidden('Acceso denegado');
        }

        if (req.role === 'SUPER_ADMIN') {
          return next();
        }

        if (!allowedRoles.includes(req.role)) {
          throw CustomError.forbidden('No tiene permisos para realizar esta acción');
        }

        next();
      } catch (error) {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
      }
    };
  }
}
