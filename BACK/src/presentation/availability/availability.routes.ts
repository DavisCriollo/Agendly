import { Router } from 'express';
import { AvailabilityController } from './availability.controller';
import { StaffMongoDatasource } from '../../infrastructure/datasources/staff.mongo.datasource';
import { StaffRepositoryImpl } from '../../infrastructure/repositories/staff.repository.impl';
import { AppointmentMongoDatasource } from '../../infrastructure/datasources/appointment.mongo.datasource';
import { AppointmentRepositoryImpl } from '../../infrastructure/repositories/appointment.repository.impl';
import { ServiceMongoDatasource } from '../../infrastructure/datasources/service.mongo.datasource';
import { ServiceRepositoryImpl } from '../../infrastructure/repositories/service.repository.impl';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AvailabilityRoutes {
  static get routes(): Router {
    const router = Router();

    const staffDatasource = new StaffMongoDatasource();
    const staffRepository = new StaffRepositoryImpl(staffDatasource);

    const appointmentDatasource = new AppointmentMongoDatasource();
    const appointmentRepository = new AppointmentRepositoryImpl(appointmentDatasource);

    const serviceDatasource = new ServiceMongoDatasource();
    const serviceRepository = new ServiceRepositoryImpl(serviceDatasource);

    const controller = new AvailabilityController(
      staffRepository,
      appointmentRepository,
      serviceRepository
    );

    router.get('/slots', [AuthMiddleware.validateJWT], controller.getAvailableSlots);

    return router;
  }
}
