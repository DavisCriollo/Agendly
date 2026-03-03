import { AppointmentStatus } from '../../entities/appointment.entity';

export interface UpdateAppointmentDto {
  status?: AppointmentStatus;
  notes?: string;
}

export class UpdateAppointmentDtoValidator {
  static create(object: { [key: string]: any }): [string?, UpdateAppointmentDto?] {
    const { status, notes } = object;

    const result: UpdateAppointmentDto = {};
    const validStatuses: AppointmentStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return ['Estado de cita inválido', undefined];
      }
      result.status = status;
    }
    if (notes !== undefined) result.notes = notes?.trim();

    return [undefined, result];
  }
}
