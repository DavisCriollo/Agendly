import { Router } from 'express';
import { ServicesController } from './services.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class ServicesRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ServicesController();

    router.post('/', [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])], controller.create);
    router.get('/', [AuthMiddleware.validateJWT], controller.getByBusiness);

    return router;
  }
}
