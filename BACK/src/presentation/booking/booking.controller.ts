import { Request, Response } from 'express';
import { QuickBookingDto } from '../../domain/dtos/booking/quick-booking.dto';
import { QuickBookingUseCase } from '../../domain/use-cases/booking/quick-booking.use-case';
import { GetAvailableSlotsUseCase } from '../../domain/use-cases/availability/get-available-slots.use-case';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { StaffRepository } from '../../domain/repositories/staff.repository';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { BusinessRepository } from '../../domain/repositories/business.repository';
import { CustomError } from '../../domain/errors/custom.error';
import { ClientSourceRequest } from '../middlewares/client-source.middleware';
import { SocketService } from '../../infrastructure/services/socket.service';

export class BookingController {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly clientRepository: ClientRepository,
    private readonly userRepository: UserRepository,
    private readonly staffRepository: StaffRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly businessRepository: BusinessRepository
  ) {}

  getBookingInfo = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const business = await this.businessRepository.findBySlug(slug);
      if (!business) {
        throw CustomError.notFound('Negocio no encontrado');
      }

      const services = await this.serviceRepository.findByBusinessId(business.id);
      const staff = await this.staffRepository.findByBusinessId(business.id);

      res.json({
        success: true,
        data: {
          business: {
            id: business.id,
            name: business.name,
            logoUrl: business.logoUrl,
            primaryColor: business.primaryColor,
            secondaryColor: business.secondaryColor,
            slug: business.slug,
          },
          services: services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            duration: s.duration,
            price: s.price,
          })),
          staff: staff.map((s) => ({
            id: s.id,
            name: s.name,
            avatarUrl: s.avatarUrl,
            services: s.services,
          })),
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };

  getAvailableSlots = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { staffId, serviceId, date } = req.query;

      if (!staffId || !serviceId || !date) {
        throw CustomError.badRequest('staffId, serviceId y date son requeridos');
      }

      const business = await this.businessRepository.findBySlug(slug);
      if (!business) {
        throw CustomError.notFound('Negocio no encontrado');
      }

      const useCase = new GetAvailableSlotsUseCase(
        this.staffRepository,
        this.appointmentRepository,
        this.serviceRepository
      );

      const slots = await useCase.execute({
        businessId: business.id,
        staffId: staffId as string,
        serviceId: serviceId as string,
        date: new Date(date as string),
      });

      res.json({ success: true, data: slots });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };

  quickBooking = async (req: ClientSourceRequest, res: Response) => {
    try {
      const { slug } = req.params;

      const business = await this.businessRepository.findBySlug(slug);
      if (!business) {
        throw CustomError.notFound('Negocio no encontrado');
      }

      const [error, dto] = QuickBookingDto.create({
        ...req.body,
        businessId: business.id,
      });

      if (error) {
        throw CustomError.badRequest(error);
      }

      const useCase = new QuickBookingUseCase(
        this.appointmentRepository,
        this.clientRepository,
        this.userRepository
      );

      const clientDevice = req.clientSource === 'mobile_ios' ? 'ios' : 
                          req.clientSource === 'mobile_android' ? 'android' : 'web';

      const appointment = await useCase.execute(dto!, clientDevice, 'web_booking');

      SocketService.emitAppointmentCreated(business.id, appointment);

      res.status(201).json({
        success: true,
        data: appointment,
        message: 'Cita creada exitosamente. Recibirás una confirmación pronto.',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.name,
            message: error.message,
            status: error.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
          },
        });
      }
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno del servidor',
          status: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
  };
}
