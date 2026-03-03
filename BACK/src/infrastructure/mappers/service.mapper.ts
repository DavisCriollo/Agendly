import { ServiceEntity } from '../../domain/entities/service.entity';
import { IService } from '../datasources/mongo/models/service.model';

export class ServiceMapper {
  static fromMongo(document: IService): ServiceEntity {
    return {
      id: document._id.toString(),
      businessId: document.businessId,
      name: document.name,
      description: document.description,
      duration: document.duration,
      price: document.price,
      costOfService: document.costOfService,
      category: document.category,
      isActive: document.isActive,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
