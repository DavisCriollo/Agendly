import { ServiceEntity } from '../entities/service.entity';

export interface ServiceRepository {
  create(service: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceEntity>;
  findByBusinessId(businessId: string): Promise<ServiceEntity[]>;
  findById(id: string, businessId: string): Promise<ServiceEntity | null>;
}
