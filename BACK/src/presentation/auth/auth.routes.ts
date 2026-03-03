import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new AuthController();

    router.post('/login', controller.login);
    router.post('/register', controller.register);
    router.put('/fcm-token', [AuthMiddleware.validateJWT], controller.updateFcmToken);

    return router;
  }
}
