import { Router } from 'express';
import { BusinessController } from './business.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

export class BusinessRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new BusinessController();

    router.post('/', controller.create);
    router.get('/:id', controller.getById);
    router.put('/:id', [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])], uploadMiddleware.single('logo'), controller.update);

    return router;
  }
}
