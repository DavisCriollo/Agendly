import { StaffEntity } from '../entities/staff.entity';

export interface StaffDatasource {
  create(staff: Omit<StaffEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any>;
  findByBusinessId(businessId: string): Promise<any[]>;
  findById(id: string, businessId: string): Promise<any | null>;
  update(id: string, businessId: string, data: Partial<StaffEntity>): Promise<any>;
}
