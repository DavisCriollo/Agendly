import { Router } from 'express';
import { ReviewController } from './review.controller';
import { ReviewMongoDatasource } from '../../infrastructure/datasources/review.mongo.datasource';
import { ReviewRepositoryImpl } from '../../infrastructure/repositories/review.repository.impl';
import { StaffMongoDatasource } from '../../infrastructure/datasources/staff.mongo.datasource';
import { StaffRepositoryImpl } from '../../infrastructure/repositories/staff.repository.impl';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class ReviewRoutes {
  static get routes(): Router {
    const router = Router();
    
    const reviewDatasource = new ReviewMongoDatasource();
    const reviewRepository = new ReviewRepositoryImpl(reviewDatasource);
    
    const staffDatasource = new StaffMongoDatasource();
    const staffRepository = new StaffRepositoryImpl(staffDatasource);
    
    const controller = new ReviewController(reviewRepository, staffRepository);

    router.post(
      '/',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['USER', 'ADMIN', 'STAFF'])],
      controller.createReview
    );

    router.get(
      '/business/:businessId',
      [AuthMiddleware.validateJWT],
      controller.getReviewsByBusiness
    );

    router.get(
      '/business/:businessId/staff/:staffId',
      [AuthMiddleware.validateJWT],
      controller.getReviewsByStaff
    );

    router.get(
      '/business/:businessId/staff/:staffId/average',
      [AuthMiddleware.validateJWT],
      controller.getStaffAverageRating
    );

    return router;
  }
}
