import { BusinessEntity } from '../entities/business.entity';

export interface BusinessDatasource {
  create(business: Omit<BusinessEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any>;
  findById(id: string): Promise<any | null>;
  findBySlug(slug: string): Promise<any | null>;
  update(id: string, data: Partial<BusinessEntity>): Promise<any>;
}
