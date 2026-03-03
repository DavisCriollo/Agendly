import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { ReportsService } from '../../infrastructure/services/reports.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class ReportsRoutes {
  static get routes(): Router {
    const router = Router();
    const reportsService = new ReportsService();
    const controller = new ReportsController(reportsService);

    router.get(
      '/revenue/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])],
      controller.getRevenueReport
    );

    router.get(
      '/staff-ranking/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])],
      controller.getStaffRanking
    );

    router.get(
      '/top-services/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])],
      controller.getTopServices
    );

    router.get(
      '/retention/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN'])],
      controller.getRetentionReport
    );

    router.get(
      '/super-admin/metrics',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['SUPER_ADMIN'])],
      controller.getSuperAdminMetrics
    );

    return router;
  }
}
