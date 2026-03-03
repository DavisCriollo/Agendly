import { AppointmentEntity } from '../entities/appointment.entity';

export interface AppointmentRepository {
  create(appointment: Omit<AppointmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentEntity>;
  findById(id: string, businessId: string): Promise<AppointmentEntity | null>;
  findByBusinessId(businessId: string, startDate?: Date, endDate?: Date): Promise<AppointmentEntity[]>;
  findByStaffAndDateRange(staffId: string, businessId: string, startDate: Date, endDate: Date): Promise<AppointmentEntity[]>;
  update(id: string, businessId: string, data: Partial<AppointmentEntity>): Promise<AppointmentEntity>;
}
