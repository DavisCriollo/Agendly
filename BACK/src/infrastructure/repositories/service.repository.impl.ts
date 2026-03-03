import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceDatasource } from '../../domain/datasources/service.datasource';
import { ServiceMapper } from '../mappers/service.mapper';

export class ServiceRepositoryImpl implements ServiceRepository {
  constructor(private readonly datasource: ServiceDatasource) {}

  async create(service: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceEntity> {
    const doc = await this.datasource.create(service);
    return ServiceMapper.fromMongo(doc);
  }

  async findByBusinessId(businessId: string): Promise<ServiceEntity[]> {
    const docs = await this.datasource.findByBusinessId(businessId);
    return docs.map((doc) => ServiceMapper.fromMongo(doc));
  }

  async findById(id: string, businessId: string): Promise<ServiceEntity | null> {
    const doc = await this.datasource.findById(id, businessId);
    return doc ? ServiceMapper.fromMongo(doc) : null;
  }
}
