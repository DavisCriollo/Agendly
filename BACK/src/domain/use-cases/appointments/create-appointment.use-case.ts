import { CreateAppointmentDto } from '../../dtos/appointments/create-appointment.dto';
import { AppointmentEntity, AppointmentStatus } from '../../entities/appointment.entity';
import { AppointmentRepository } from '../../repositories/appointment.repository';
import { ServiceRepository } from '../../repositories/service.repository';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly serviceRepository: ServiceRepository
  ) {}

  async execute(dto: CreateAppointmentDto): Promise<AppointmentEntity> {
    const service = await this.serviceRepository.findById(dto.serviceId, dto.businessId);
    if (!service) throw new Error('Servicio no encontrado');

    const endTime = new Date(dto.startTime.getTime() + service.duration * 60 * 1000);

    return this.appointmentRepository.create({
      ...dto,
      endTime,
      status: 'PENDING' as AppointmentStatus,
      isFirstTime: false,
      clientDevice: 'unknown',
    });
  }
}
