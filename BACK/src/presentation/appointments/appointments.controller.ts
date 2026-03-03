import { Response, NextFunction } from 'express';
import { CreateAppointmentUseCase } from '../../domain/use-cases/appointments/create-appointment.use-case';
import { CancelAppointmentUseCase } from '../../domain/use-cases/appointments/cancel-appointment.use-case';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { CreateAppointmentDtoValidator } from '../../domain/dtos/appointments/create-appointment.dto';
import { BadRequestError, NotFoundError } from '../../domain/errors/custom.error';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ClientSourceRequest } from '../middlewares/client-source.middleware';
import { FirebaseAdapter } from '../../config/firebase.adapter';
import { SocketService } from '../../infrastructure/services/socket.service';
import { UserRepository } from '../../domain/repositories/user.repository';

interface AppointmentRequest extends AuthRequest, ClientSourceRequest {}

export class AppointmentsController {
  private getAppointmentRepository(): AppointmentRepository {
    const { AppointmentMongoDatasource } = require('../../infrastructure/datasources/appointment.mongo.datasource');
    const { AppointmentRepositoryImpl } = require('../../infrastructure/repositories/appointment.repository.impl');
    return new AppointmentRepositoryImpl(new AppointmentMongoDatasource());
  }

  private getServiceRepository(): ServiceRepository {
    const { ServiceMongoDatasource } = require('../../infrastructure/datasources/service.mongo.datasource');
    const { ServiceRepositoryImpl } = require('../../infrastructure/repositories/service.repository.impl');
    return new ServiceRepositoryImpl(new ServiceMongoDatasource());
  }

  private getUserRepository(): UserRepository {
    const { UserMongoDatasource } = require('../../infrastructure/datasources/user.mongo.datasource');
    const { UserRepositoryImpl } = require('../../infrastructure/repositories/user.repository.impl');
    return new UserRepositoryImpl(new UserMongoDatasource());
  }

  create = async (req: AppointmentRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const createData = {
        ...req.body,
        businessId: req.businessId,
        customerId: req.userId,
        clientSource: req.clientSource || 'unknown',
        medicalRecordUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const [error, dto] = CreateAppointmentDtoValidator.create(createData);
      if (error) throw new BadRequestError(error);

      const appointmentRepo = this.getAppointmentRepository();
      const serviceRepo = this.getServiceRepository();
      const createUseCase = new CreateAppointmentUseCase(appointmentRepo, serviceRepo);
      const appointment = await createUseCase.execute(dto!);

      SocketService.emitAppointmentCreated(req.businessId, appointment);

      const userRepo = this.getUserRepository();
      const customer = await userRepo.findById(appointment.customerId);
      if (customer?.fcmToken) {
        FirebaseAdapter.sendPushNotification(
          customer.fcmToken,
          'Nueva cita',
          `Tu cita ha sido agendada para ${new Date(appointment.startTime).toLocaleString()}`
        );
      }

      res.status(201).json({ ok: true, appointment });
    } catch (err) {
      next(err);
    }
  };

  getByBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const { startDate, endDate } = req.query;
      const appointmentRepo = this.getAppointmentRepository();
      const appointments = await appointmentRepo.findByBusinessId(
        req.businessId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json({ ok: true, appointments });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const appointmentRepo = this.getAppointmentRepository();
      const appointment = await appointmentRepo.findById(id, req.businessId);
      if (!appointment) throw new NotFoundError('Cita no encontrada');

      res.json({ ok: true, appointment });
    } catch (err) {
      next(err);
    }
  };

  cancel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const appointmentRepo = this.getAppointmentRepository();
      const cancelUseCase = new CancelAppointmentUseCase(appointmentRepo);
      const appointment = await cancelUseCase.execute(id, req.businessId);

      SocketService.emitAppointmentCancelled(req.businessId, appointment);

      const userRepo = this.getUserRepository();
      const customer = await userRepo.findById(appointment.customerId);
      if (customer?.fcmToken) {
        FirebaseAdapter.sendPushNotification(customer.fcmToken, 'Cita cancelada', 'Tu cita ha sido cancelada.');
      }

      res.json({ ok: true, appointment });
    } catch (err) {
      next(err);
    }
  };
}
