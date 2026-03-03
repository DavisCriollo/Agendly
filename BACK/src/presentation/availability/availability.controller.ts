import { Request, Response } from 'express';
import { GetAvailableSlotsUseCase } from '../../domain/use-cases/availability/get-available-slots.use-case';
import { StaffRepository } from '../../domain/repositories/staff.repository';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { CustomError } from '../../domain/errors/custom.error';

export class AvailabilityController {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly serviceRepository: ServiceRepository
  ) {}

  getAvailableSlots = async (req: Request, res: Response) => {
    try {
      const { businessId, staffId, serviceId, date } = req.query;

      if (!businessId || !staffId || !serviceId || !date) {
        return res.status(400).json({
          success: false,
          error: 'businessId, staffId, serviceId y date son requeridos',
        });
      }

      const useCase = new GetAvailableSlotsUseCase(
        this.staffRepository,
        this.appointmentRepository,
        this.serviceRepository
      );

      const slots = await useCase.execute({
        businessId: businessId as string,
        staffId: staffId as string,
        serviceId: serviceId as string,
        date: new Date(date as string),
      });

      res.json({ success: true, data: slots });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };
}
