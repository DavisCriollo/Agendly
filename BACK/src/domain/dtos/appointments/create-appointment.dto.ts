import { AppointmentStatus } from '../../entities/appointment.entity';

export interface CreateAppointmentDto {
  businessId: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  startTime: Date;
  notes?: string;
  medicalRecordUrl?: string;
}

export class CreateAppointmentDtoValidator {
  static create(object: { [key: string]: any }): [string?, CreateAppointmentDto?] {
    const { businessId, customerId, staffId, serviceId, startTime, notes, medicalRecordUrl } = object;

    if (!businessId || typeof businessId !== 'string') {
      return ['El businessId es requerido', undefined];
    }
    if (!customerId || typeof customerId !== 'string') {
      return ['El customerId es requerido', undefined];
    }
    if (!staffId || typeof staffId !== 'string') {
      return ['El staffId es requerido', undefined];
    }
    if (!serviceId || typeof serviceId !== 'string') {
      return ['El serviceId es requerido', undefined];
    }
    if (!startTime) {
      return ['La fecha y hora de inicio es requerida', undefined];
    }

    const start = startTime instanceof Date ? startTime : new Date(startTime);
    if (isNaN(start.getTime())) {
      return ['La fecha de inicio no es válida', undefined];
    }
    if (start <= new Date()) {
      return ['La cita debe ser en el futuro', undefined];
    }

    return [
      undefined,
      {
        businessId,
        customerId,
        staffId,
        serviceId,
        startTime: start,
        notes: notes?.trim(),
        medicalRecordUrl,
      },
    ];
  }
}
