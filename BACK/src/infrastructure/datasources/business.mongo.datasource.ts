import { BusinessDatasource } from '../../domain/datasources/business.datasource';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { BusinessModel } from './mongo/models/business.model';

export class BusinessMongoDatasource implements BusinessDatasource {
  async create(business: Omit<BusinessEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const doc = await BusinessModel.create(business);
    return doc;
  }

  async findById(id: string): Promise<any | null> {
    return BusinessModel.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<any | null> {
    return BusinessModel.findOne({ slug: slug.toLowerCase() }).exec();
  }

  async update(id: string, data: Partial<BusinessEntity>): Promise<any> {
    const doc = await BusinessModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    return doc;
  }
}
