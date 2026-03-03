import { Router } from 'express';
import { AppointmentsController } from './appointments.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

export class AppointmentsRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new AppointmentsController();

    router.post('/', [AuthMiddleware.validateJWT], uploadMiddleware.single('medicalRecord'), controller.create);
    router.get('/', [AuthMiddleware.validateJWT], controller.getByBusiness);
    router.get('/:id', [AuthMiddleware.validateJWT], controller.getById);
    router.patch('/:id/cancel', [AuthMiddleware.validateJWT], controller.cancel);

    return router;
  }
}
