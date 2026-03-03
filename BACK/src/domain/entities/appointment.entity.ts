export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type ClientDevice = 'web' | 'ios' | 'android' | 'unknown';

export interface AppointmentEntity {
  id: string;
  businessId: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  isFirstTime: boolean;
  cancellationReason?: string;
  clientDevice: ClientDevice;
  notes?: string;
  medicalRecordUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
