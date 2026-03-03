import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from '../../infrastructure/services/analytics.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class AnalyticsRoutes {
  static get routes(): Router {
    const router = Router();
    const analyticsService = new AnalyticsService();
    const controller = new AnalyticsController(analyticsService);

    router.get(
      '/profitability/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.getProfitability
    );

    router.get(
      '/efficiency/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.getEfficiency
    );

    router.get(
      '/retention/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.getRetention
    );

    router.get(
      '/heatmap/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.getHeatMap
    );

    router.get(
      '/dashboard/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.getDashboard
    );

    return router;
  }
}
