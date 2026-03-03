import { ClientEntity } from '../../domain/entities/client.entity';
import { IClient } from '../datasources/mongo/models/client.model';

export class ClientMapper {
  static toEntity(model: IClient): ClientEntity {
    return {
      id: model._id.toString(),
      businessId: model.businessId,
      userId: model.userId,
      name: model.name,
      email: model.email,
      phone: model.phone,
      birthDate: model.birthDate,
      referredBy: model.referredBy,
      source: model.source as ClientEntity['source'],
      avatarUrl: model.avatarUrl,
      notes: model.notes,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
