import { Router } from 'express';
import { BookingController } from './booking.controller';
import { AppointmentMongoDatasource } from '../../infrastructure/datasources/appointment.mongo.datasource';
import { AppointmentRepositoryImpl } from '../../infrastructure/repositories/appointment.repository.impl';
import { ClientMongoDatasource } from '../../infrastructure/datasources/client.mongo.datasource';
import { ClientRepositoryImpl } from '../../infrastructure/repositories/client.repository.impl';
import { UserMongoDatasource } from '../../infrastructure/datasources/user.mongo.datasource';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user.repository.impl';
import { StaffMongoDatasource } from '../../infrastructure/datasources/staff.mongo.datasource';
import { StaffRepositoryImpl } from '../../infrastructure/repositories/staff.repository.impl';
import { ServiceMongoDatasource } from '../../infrastructure/datasources/service.mongo.datasource';
import { ServiceRepositoryImpl } from '../../infrastructure/repositories/service.repository.impl';
import { BusinessMongoDatasource } from '../../infrastructure/datasources/business.mongo.datasource';
import { BusinessRepositoryImpl } from '../../infrastructure/repositories/business.repository.impl';
import { appointmentRateLimiter } from '../middlewares/rate-limit.middleware';

export class BookingRoutes {
  static get routes(): Router {
    const router = Router();

    const appointmentDatasource = new AppointmentMongoDatasource();
    const appointmentRepository = new AppointmentRepositoryImpl(appointmentDatasource);

    const clientDatasource = new ClientMongoDatasource();
    const clientRepository = new ClientRepositoryImpl(clientDatasource);

    const userDatasource = new UserMongoDatasource();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const staffDatasource = new StaffMongoDatasource();
    const staffRepository = new StaffRepositoryImpl(staffDatasource);

    const serviceDatasource = new ServiceMongoDatasource();
    const serviceRepository = new ServiceRepositoryImpl(serviceDatasource);

    const businessDatasource = new BusinessMongoDatasource();
    const businessRepository = new BusinessRepositoryImpl(businessDatasource);

    const controller = new BookingController(
      appointmentRepository,
      clientRepository,
      userRepository,
      staffRepository,
      serviceRepository,
      businessRepository
    );

    router.get('/:slug', controller.getBookingInfo);
    router.get('/:slug/availability', controller.getAvailableSlots);
    router.post('/:slug/book', [appointmentRateLimiter], controller.quickBooking);

    return router;
  }
}
