import { Router } from 'express';
import { StaffController } from './staff.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

export class StaffRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new StaffController();

    router.post('/', [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])], uploadMiddleware.single('avatar'), controller.create);
    router.get('/', [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'STAFF'])], controller.getByBusiness);
    router.put('/:id', [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])], uploadMiddleware.single('avatar'), controller.update);

    return router;
  }
}
