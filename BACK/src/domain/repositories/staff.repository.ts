import { StaffEntity } from '../entities/staff.entity';

export interface StaffRepository {
  create(staff: Omit<StaffEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaffEntity>;
  findByBusinessId(businessId: string): Promise<StaffEntity[]>;
  findById(id: string, businessId: string): Promise<StaffEntity | null>;
  update(id: string, businessId: string, data: Partial<StaffEntity>): Promise<StaffEntity>;
}
