import { AppointmentEntity } from '../entities/appointment.entity';

export interface AppointmentDatasource {
  create(appointment: Omit<AppointmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any>;
  findById(id: string, businessId: string): Promise<any | null>;
  findByBusinessId(businessId: string, startDate?: Date, endDate?: Date): Promise<any[]>;
  findByStaffAndDateRange(staffId: string, businessId: string, startDate: Date, endDate: Date): Promise<any[]>;
  update(id: string, businessId: string, data: Partial<AppointmentEntity>): Promise<any>;
}
