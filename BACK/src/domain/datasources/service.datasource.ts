import { ServiceEntity } from '../entities/service.entity';

export interface ServiceDatasource {
  create(service: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any>;
  findByBusinessId(businessId: string): Promise<any[]>;
  findById(id: string, businessId: string): Promise<any | null>;
}
