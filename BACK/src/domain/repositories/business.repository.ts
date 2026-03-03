import { BusinessEntity } from '../entities/business.entity';

export interface BusinessRepository {
  create(business: Omit<BusinessEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessEntity>;
  findById(id: string): Promise<BusinessEntity | null>;
  findBySlug(slug: string): Promise<BusinessEntity | null>;
  update(id: string, data: Partial<BusinessEntity>): Promise<BusinessEntity>;
}
