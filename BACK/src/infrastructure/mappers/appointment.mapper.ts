import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import { IAppointment } from '../datasources/mongo/models/appointment.model';

export class AppointmentMapper {
  static fromMongo(document: IAppointment): AppointmentEntity {
    return {
      id: document._id.toString(),
      businessId: document.businessId,
      customerId: document.customerId,
      staffId: document.staffId,
      serviceId: document.serviceId,
      startTime: document.startTime,
      endTime: document.endTime,
      status: document.status as AppointmentEntity['status'],
      checkInTime: document.checkInTime,
      checkOutTime: document.checkOutTime,
      isFirstTime: document.isFirstTime,
      cancellationReason: document.cancellationReason,
      clientDevice: document.clientDevice as AppointmentEntity['clientDevice'],
      notes: document.notes,
      medicalRecordUrl: document.medicalRecordUrl,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
