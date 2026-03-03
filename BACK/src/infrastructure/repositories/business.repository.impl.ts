import { BusinessRepository } from '../../domain/repositories/business.repository';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { BusinessDatasource } from '../../domain/datasources/business.datasource';
import { BusinessMapper } from '../mappers/business.mapper';

export class BusinessRepositoryImpl implements BusinessRepository {
  constructor(private readonly datasource: BusinessDatasource) {}

  async create(business: Omit<BusinessEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessEntity> {
    const doc = await this.datasource.create(business);
    return BusinessMapper.fromMongo(doc);
  }

  async findById(id: string): Promise<BusinessEntity | null> {
    const doc = await this.datasource.findById(id);
    return doc ? BusinessMapper.fromMongo(doc) : null;
  }

  async findBySlug(slug: string): Promise<BusinessEntity | null> {
    const doc = await this.datasource.findBySlug(slug);
    return doc ? BusinessMapper.fromMongo(doc) : null;
  }

  async update(id: string, data: Partial<BusinessEntity>): Promise<BusinessEntity> {
    const doc = await this.datasource.update(id, data);
    return BusinessMapper.fromMongo(doc);
  }
}
