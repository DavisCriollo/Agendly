import { NotFoundError } from '../../errors/custom.error';
import { AppointmentEntity } from '../../entities/appointment.entity';
import { AppointmentRepository } from '../../repositories/appointment.repository';

export class CancelAppointmentUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(appointmentId: string, businessId: string): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.findById(appointmentId, businessId);
    if (!appointment) throw new NotFoundError('Cita no encontrada');

    return this.appointmentRepository.update(appointmentId, businessId, { status: 'CANCELLED' });
  }
}
