import { Router } from 'express';
import { MarketingController } from './marketing.controller';
import { MarketingService } from '../../infrastructure/services/marketing.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class MarketingRoutes {
  static get routes(): Router {
    const router = Router();
    const marketingService = new MarketingService();
    const controller = new MarketingController(marketingService);

    router.get(
      '/welcome-kit/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.getWelcomeKit
    );

    router.post(
      '/welcome-kit/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.createWelcomeKit
    );

    router.get('/join/:slug', controller.handleDeepLink);

    router.get(
      '/flyer/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])],
      controller.generateFlyerPDF
    );

    return router;
  }
}
