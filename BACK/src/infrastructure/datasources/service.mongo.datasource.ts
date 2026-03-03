import { ServiceDatasource } from '../../domain/datasources/service.datasource';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceModel } from './mongo/models/service.model';

export class ServiceMongoDatasource implements ServiceDatasource {
  async create(service: Omit<ServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const doc = await ServiceModel.create(service);
    return doc;
  }

  async findByBusinessId(businessId: string): Promise<any[]> {
    return ServiceModel.find({ businessId }).exec();
  }

  async findById(id: string, businessId: string): Promise<any | null> {
    return ServiceModel.findOne({ _id: id, businessId }).exec();
  }
}
